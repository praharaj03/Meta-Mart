'use client';

import { useState, useRef, useEffect } from 'react';

// ─── MASTER SWITCH ────────────────────────────────────────────────────────────
// Set to true only when you've tested and approved the chat feature
const CHAT_ENABLED = false;
// ─────────────────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'What products do you have?',
  'How does shipping work?',
  'What is your return policy?',
  'How do I track my order?',
];

// ─── OFFLINE Q&A — no API call needed ────────────────────────────────────────
const QUICK_ANSWERS: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['shipping', 'deliver', 'delivery', 'how long', 'arrive', 'dispatch'],
    answer: '🚚 We offer free shipping on orders above ₹499. Standard delivery takes 3–7 business days. Express (1–2 days) is available at checkout for select pincodes.',
  },
  {
    keywords: ['return', 'refund', 'exchange', 'send back', 'replace'],
    answer: '↩️ We accept returns within 7 days of delivery for unused items in original packaging. Visit the Orders page to initiate a return. Refunds are processed in 5–7 business days.',
  },
  {
    keywords: ['track', 'tracking', 'where is my order', 'order status', 'shipped'],
    answer: '📦 You can track your order on the Orders page (/orders). You\'ll also receive a shipping confirmation email with a tracking link once your order is dispatched.',
  },
  {
    keywords: ['payment', 'pay', 'upi', 'card', 'cod', 'cash on delivery', 'stripe', 'razorpay'],
    answer: '💳 We accept UPI, Credit/Debit cards, and Net Banking via Stripe. Cash on Delivery is not available currently.',
  },
  {
    keywords: ['cancel', 'cancellation', 'cancel order'],
    answer: '❌ Orders can be cancelled within 1 hour of placing them. After that, please wait for delivery and initiate a return. Contact us at /contact for urgent cancellations.',
  },
  {
    keywords: ['coupon', 'discount', 'promo', 'offer', 'code', 'deal'],
    answer: '🏷️ We run seasonal offers and discounts. Subscribe to our newsletter (in the footer) to get exclusive promo codes first!',
  },
  {
    keywords: ['contact', 'support', 'help', 'customer care', 'email', 'phone'],
    answer: '📬 You can reach us via the Contact page (/contact). We typically respond within 24 hours on business days.',
  },
  {
    keywords: ['product', 'what do you sell', 'categories', 'items', 'catalogue', 'catalog'],
    answer: '🛍️ We sell electronics, accessories, lifestyle products, and more. Browse everything on the Shop page (/shop) — new arrivals added regularly!',
  },
  {
    keywords: ['account', 'sign in', 'login', 'sign up', 'register', 'profile'],
    answer: '👤 You can sign in or create an account using the button in the top-right navbar. We use Clerk for secure authentication.',
  },
  {
    keywords: ['invoice', 'bill', 'receipt', 'pdf'],
    answer: '🧾 You can download your invoice as a PDF from the Orders page (/orders) after your order is placed.',
  },
];

function getQuickAnswer(text: string): string | null {
  const lower = text.toLowerCase();
  for (const { keywords, answer } of QUICK_ANSWERS) {
    if (keywords.some(k => lower.includes(k))) return answer;
  }
  return null;
}
// ─────────────────────────────────────────────────────────────────────────────

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! 👋 I'm MetaMart's assistant. Ask me anything about our products, shipping, or returns!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: 'user', content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    setError('');

    // Check offline answers first — no API call needed
    const quick = getQuickAnswer(content);
    if (quick) {
      setMessages(prev => [...prev, { role: 'assistant', content: quick }]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? 'Something went wrong.');
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // ── Disabled state — shows tooltip on hover ──────────────────────────────
  if (!CHAT_ENABLED) {
    return (
      <div className="fixed bottom-20 right-6 z-40 group">
        <button
          disabled
          className="w-12 h-12 rounded-full bg-[#13111b] border border-purple-400/20 flex items-center justify-center text-purple-400/40 cursor-not-allowed shadow-lg"
          aria-label="Live chat coming soon"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
        <div className="absolute bottom-14 right-0 bg-[#13111b] border border-purple-400/20 text-zinc-300 text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Live chat coming soon
        </div>
      </div>
    );
  }

  // ── Active chat ───────────────────────────────────────────────────────────
  return (
    <div className="fixed bottom-20 right-6 z-40">

      {/* Toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-12 h-12 rounded-full glow-button flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform duration-200"
        aria-label="Toggle live chat"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="absolute bottom-16 right-0 w-[340px] sm:w-[380px] bg-[#0f0d18] border border-purple-400/25 rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
          style={{ height: '480px' }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-[#13111b]">
            <div className="w-8 h-8 rounded-full glow-button flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">MetaMart Assistant</p>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse"/>
                Online
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white transition-colors p-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-sm'
                    : 'bg-[#1e1a2e] text-zinc-200 border border-white/8 rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#1e1a2e] border border-white/8 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-xs text-red-400 text-center px-2">{error}</div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggestions — only show on first message */}
          {messages.length === 1 && !loading && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/25 text-purple-300 hover:bg-purple-500/30 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-white/8">
            <div className="flex gap-2 items-center bg-[#1e1a2e] border border-white/10 rounded-xl px-3 py-2 focus-within:border-purple-400/50 transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything..."
                maxLength={500}
                className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded-lg glow-button flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-zinc-600 text-center mt-1.5">Powered by Gemini · No personal data shared</p>
          </div>
        </div>
      )}
    </div>
  );
}
