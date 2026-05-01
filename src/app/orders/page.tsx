'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { downloadReceipt } from '@/utils/generateReceipt';

interface OrderItem { id: string; name: string; price: number; image: string; quantity: number; }
interface Order { _id: string; orderId: string; items: OrderItem[]; total: number; address: string; userName: string; userEmail: string; createdAt: string; status: string; }

const STEPS = ['Order Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
const STEP_ICONS = ['🧾', '✅', '📦', '🚚', '🏠'];

function getStep(date: string) {
  const h = (Date.now() - new Date(date).getTime()) / 36e5;
  if (h < 1) return 0; if (h < 6) return 1; if (h < 24) return 2; if (h < 48) return 3; return 4;
}

function getArrival(date: string) {
  const d = new Date(date); d.setDate(d.getDate() + 5);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width, y: -20, r: Math.random() * 8 + 4, d: Math.random() * 80 + 20,
      color: ['#3b82f6','#9333ea','#10b981','#f59e0b','#ef4444'][Math.floor(Math.random() * 5)],
      tilt: Math.random() * 10 - 10, tiltAngle: 0, tiltSpeed: Math.random() * 0.1 + 0.05,
    }));
    let frame: number; let angle = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); angle += 0.01;
      pieces.forEach(p => {
        p.tiltAngle += p.tiltSpeed; p.y += (Math.cos(angle + p.d) + 2); p.x += Math.sin(angle) * 1.5; p.tilt = Math.sin(p.tiltAngle) * 12;
        ctx.beginPath(); ctx.lineWidth = p.r; ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y); ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2); ctx.stroke();
      });
      if (pieces.some(p => p.y < canvas.height)) frame = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    draw(); return () => cancelAnimationFrame(frame);
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }} />;
}

export default function OrdersPage() {
  const { user, isLoaded } = useUser();
  const { clearCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;
    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return;

    // Check if coming from a new order (Stripe redirect)
    const params = new URLSearchParams(window.location.search);
    if (params.get('session_id')) {
      setIsNew(true);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 4000);
      clearCart();
      window.history.replaceState({}, '', '/orders');
    }

    fetch(`/api/orders?email=${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isLoaded, user]);

  if (!isLoaded || loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#f0f4ff,#faf5ff)' }}>
      <Navbar />
      <div style={{ fontSize: '14px', color: '#64748b' }}>Loading orders...</div>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0f4ff,#faf5ff)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar />
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Please sign in to view your orders.</p>
      <Link href="/login" style={{ background: 'linear-gradient(135deg,#3b82f6,#9333ea)', color: 'white', padding: '12px 28px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0f4ff 0%,#faf5ff 50%,#f0fdf4 100%)' }}>
      <Confetti active={confetti} />
      <Navbar />

      {isNew && (
        <div style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', textAlign: 'center', padding: '14px', fontSize: '15px', fontWeight: 600 }}>
          🎉 Order placed successfully! Your items are on their way.
        </div>
      )}

      <div style={{ paddingTop: isNew ? '90px' : '110px', paddingBottom: '80px', maxWidth: '860px', margin: '0 auto' }} className="px-4 sm:px-6">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, background: 'linear-gradient(135deg,#3b82f6,#9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '6px' }}>My Orders</h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} for {user.primaryEmailAddress?.emailAddress}</p>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '24px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '5rem', marginBottom: '16px' }}>📦</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>No orders yet</h2>
            <p style={{ color: '#64748b', marginBottom: '28px' }}>Start shopping to see your orders here</p>
            <Link href="/shop" style={{ background: 'linear-gradient(135deg,#3b82f6,#9333ea)', color: 'white', padding: '14px 36px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}>Shop Now</Link>
          </div>
        ) : (
          orders.map((order, idx) => {
            const step = getStep(order.createdAt);
            const isOpen = expanded === order._id;
            const receiptData = { id: order.orderId, items: order.items, total: order.total, address: order.address, name: order.userName, email: order.userEmail, date: order.createdAt, status: order.status };
            return (
              <div key={order._id} style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', marginBottom: '16px', border: isOpen ? '1.5px solid #3b82f6' : '1px solid rgba(59,130,246,0.1)', animation: `fadeUp 0.5s ease-out ${idx * 80}ms both` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                  <div><span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>ORDER ID</span><br /><span style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>{order.orderId}</span></div>
                  <div><span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>PLACED ON</span><br /><span style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                  <div><span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>TOTAL</span><br /><span style={{ fontWeight: 800, color: '#3b82f6', fontSize: '1.1rem' }}>${order.total.toFixed(2)}</span></div>
                  <div><span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>DELIVERY BY</span><br /><span style={{ fontWeight: 700, color: '#10b981', fontSize: '14px' }}>🚚 {getArrival(order.createdAt)}</span></div>
                  <button onClick={() => setExpanded(isOpen ? null : order._id)} style={{ background: isOpen ? '#f1f5f9' : 'linear-gradient(135deg,#3b82f6,#9333ea)', color: isOpen ? '#64748b' : 'white', border: 'none', padding: '8px 22px', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>{isOpen ? '▲ Hide' : '▼ Details'}</button>
                  <button onClick={() => downloadReceipt(receiptData)} style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>⬇ Receipt</button>
                </div>

                {/* Stepper */}
                <div style={{ display: 'flex', alignItems: 'flex-start', padding: '16px 0', overflowX: 'auto' }}>
                  {STEPS.map((s, i) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: i <= step ? 'linear-gradient(135deg,#3b82f6,#9333ea)' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i <= step ? '18px' : '14px', fontWeight: 700, color: i <= step ? 'white' : '#94a3b8', boxShadow: i === step ? '0 0 0 4px rgba(59,130,246,0.2)' : 'none', flexShrink: 0 }}>
                          {i < step ? '✓' : STEP_ICONS[i]}
                        </div>
                        <span style={{ fontSize: '10px', color: i <= step ? '#3b82f6' : '#94a3b8', fontWeight: i <= step ? 700 : 400, textAlign: 'center', width: '64px', lineHeight: 1.3 }}>{s}</span>
                      </div>
                      {i < STEPS.length - 1 && <div style={{ flex: 1, height: '3px', background: i < step ? 'linear-gradient(90deg,#3b82f6,#9333ea)' : '#e5e7eb', margin: '0 4px', marginBottom: '28px', borderRadius: '2px' }} />}
                    </div>
                  ))}
                </div>

                {isOpen && (
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                    <div className="orders-detail-grid">
                      <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '18px' }}>
                        <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>📍 Delivery Address</p>
                        <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px', marginBottom: '4px' }}>{order.userName}</p>
                        <p style={{ color: '#64748b', fontSize: '13px' }}>{order.address}</p>
                      </div>
                      <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '18px' }}>
                        <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase' }}>🛍️ Items</p>
                        {order.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                            <div>
                              <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '2px' }}>{item.name}</p>
                              <p style={{ fontSize: '12px', color: '#64748b' }}>Qty: {item.quantity} · <span style={{ color: '#3b82f6', fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <Footer />
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .orders-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) { .orders-detail-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
