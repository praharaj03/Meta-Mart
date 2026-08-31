import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

const STORE_POLICIES = `
STORE POLICIES — MetaMart:
- Free standard shipping on orders over $100; $15 otherwise
- Express shipping: $25 (2-3 business days)
- Overnight delivery: $45
- 30-day hassle-free return policy (items must be unused, original condition)
- Return shipping is free for defective or incorrect items
- Refunds processed within 5-10 business days to original payment method
- Payments via Stripe (card). UPI is demo-only and not active.
- Order cancellation allowed within 1 hour of placement
- Customer support: devopspraharaj25@gmail.com
- All products are 100% authentic, sourced from authorized dealers
- Tax: 8% applied at checkout
- Orders over $100 qualify for free shipping automatically
`;

const SYSTEM_PROMPT = `You are MetaMart's helpful shopping assistant. You help customers find products, answer questions about the store, shipping, returns, and policies.

STRICT RULES:
1. Only answer questions related to MetaMart, its products, policies, shipping, returns, and orders.
2. Never ask for or reference any personal information (name, email, address, payment details, order IDs).
3. If asked about a specific order status, say: "Please visit the Orders page on your account or contact us at devopspraharaj25@gmail.com"
4. Keep responses concise, friendly, and helpful.
5. If you don't know something, say so honestly and suggest contacting support.
6. Never make up products or prices — only reference what's in the catalogue below.
7. Do not answer questions unrelated to shopping or MetaMart.

${STORE_POLICIES}

LIVE PRODUCT CATALOGUE:
{{PRODUCTS}}
`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Sanitize — only keep role and text content, strip everything else
    const safeMessages = messages
      .filter((m: any) => m.role && m.content && typeof m.content === 'string')
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content.slice(0, 1000) }], // cap per message
      }));

    if (safeMessages.length === 0) {
      return NextResponse.json({ error: 'No valid messages' }, { status: 400 });
    }

    // RAG — fetch live products from DB (only safe, non-PII fields)
    let productContext = 'No products currently available.';
    try {
      await connectDB();
      const products = await Product.find()
        .select('name price originalPrice category badge rating -_id')
        .limit(50)
        .lean();

      if (products.length > 0) {
        productContext = products.map((p: any) =>
          `- ${p.name} | Category: ${p.category} | Price: $${p.price} (was $${p.originalPrice}) | Rating: ${p.rating}/5 | Badge: ${p.badge}`
        ).join('\n');
      }
    } catch {
      productContext = 'Product catalogue temporarily unavailable.';
    }

    const systemWithProducts = SYSTEM_PROMPT.replace('{{PRODUCTS}}', productContext);

    // Init Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemWithProducts,
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.7,
      },
    });

    // Separate last user message from history
    // Gemini requires history to start with 'user' — drop any leading model messages
    const rawHistory = safeMessages.slice(0, -1);
    const firstUserIdx = rawHistory.findIndex((m: any) => m.role === 'user');
    const history = firstUserIdx === -1 ? [] : rawHistory.slice(firstUserIdx);
    const lastMessage = safeMessages[safeMessages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (err: any) {
    console.error('[chat/route]', err?.message);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
