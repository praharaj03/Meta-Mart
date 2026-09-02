import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getProducts } from '@/lib/productCache';

const STORE_POLICIES = `
STORE POLICIES — MetaMart:
- Free standard shipping on orders over rs 499; rs 99 otherwise
- Express shipping: rs 199 (1-2 business days)
- 7-day return policy (items must be unused, original packaging)
- Refunds processed within 5-7 business days
- Payments via Stripe (card) and UPI
- Order cancellation allowed within 1 hour of placement
- Customer support: devopspraharaj25@gmail.com
- Tax included in displayed prices
`;

const SYSTEM_PROMPT = `You are MetaMart's helpful shopping assistant. Help customers with products, shipping, returns, and store policies.

RULES:
1. Only answer questions related to MetaMart, products, policies, shipping, returns, orders.
2. Never ask for or reference personal information (name, email, address, payment details, order IDs).
3. For specific order status questions say: "Please visit the Orders page or contact devopspraharaj25@gmail.com"
4. Keep responses concise and friendly.
5. Never make up products or prices — only reference the catalogue below.
6. Do not answer questions unrelated to MetaMart or shopping.

${STORE_POLICIES}

LIVE PRODUCT CATALOGUE:
{{PRODUCTS}}
`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Chat service not configured.' }, { status: 503 });
    }

    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Sanitize messages — only user/assistant roles with string content
    const sanitized = messages
      .filter((m: any) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content.slice(0, 1000) }],
      }));

    if (sanitized.length === 0) {
      return NextResponse.json({ error: 'No valid messages' }, { status: 400 });
    }

    // Last message must be from user
    const lastMsg = sanitized[sanitized.length - 1];
    if (lastMsg.role !== 'user') {
      return NextResponse.json({ error: 'Last message must be from user' }, { status: 400 });
    }

    // Build history — must start with user and strictly alternate user/model
    const rawHistory = sanitized.slice(0, -1);
    const firstUserIdx = rawHistory.findIndex((m: any) => m.role === 'user');
    const history = firstUserIdx === -1 ? [] : rawHistory.slice(firstUserIdx);

    // RAG — fetch live products (Redis-cached)
    let productContext = 'No products currently available.';
    try {
      const products = await getProducts();
      if (products.length > 0) {
        productContext = products.slice(0, 50).map((p: any) =>
          `- ${p.name} | ${p.category} | rs ${p.price} (was rs ${p.originalPrice}) | ${p.rating}/5 stars | ${p.badge}`
        ).join('\n');
      }
    } catch {
      productContext = 'Product catalogue temporarily unavailable.';
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT.replace('{{PRODUCTS}}', productContext),
      generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMsg.parts[0].text);

    return NextResponse.json({ reply: result.response.text() });
  } catch (err: any) {
    console.error('[chat/route]', err?.message);
    return NextResponse.json({ error: err?.message ?? 'Something went wrong.' }, { status: 500 });
  }
}
