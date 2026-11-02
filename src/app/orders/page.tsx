'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppAuth } from '@/context/AppAuthContext';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { downloadReceipt } from '@/utils/generateReceipt';
import emailjs from '@emailjs/browser';

interface OrderItem { id: string; name: string; price: number; image: string; quantity: number; }
interface Order { _id: string; orderId: string; items: OrderItem[]; total: number; address: string; userName: string; userEmail: string; createdAt: string; status: string; returnRequestedAt?: string; returnType?: string; }

const STEPS = ['Order Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
const STEP_ICONS = ['🧾', '✅', '📦', '🚚', '🏠'];
const CANCEL_REASONS = [
  'Changed my mind',
  'Ordered by mistake',
  'Found a better price',
  'Delivery time too long',
  'Other',
];

const RETURN_REASONS = [
  'Item damaged or defective',
  'Wrong item received',
  'Item not as described',
  'Changed my mind',
  'Other',
];

function getReturnDeadline(date: string) {
  const d = new Date(date);
  d.setDate(d.getDate() + 12); // 5 days delivery + 7 days return window
  return d;
}

function daysLeftToReturn(date: string) {
  const deadline = getReturnDeadline(date);
  return Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

const RETURN_STEPS = ['Return Requested', 'Pickup Scheduled', 'Item Picked Up', 'Checking Product', 'Refund Processed', 'Refunded'];
const RETURN_STEP_ICONS = ['🔄', '📅', '🚚', '🔍', '💳', '✅'];
const REPLACEMENT_STEPS = ['Return Requested', 'Pickup Scheduled', 'Item Picked Up', 'Checking Product', 'Replacement Dispatched', 'Delivered'];
const REPLACEMENT_STEP_ICONS = ['🔄', '📅', '🚚', '🔍', '📦', '🏠'];

function getReturnStep(returnRequestedAt: string) {
  const h = (Date.now() - new Date(returnRequestedAt).getTime()) / 36e5;
  if (h < 2) return 0;
  if (h < 12) return 1;
  if (h < 24) return 2;
  if (h < 36) return 3;
  if (h < 48) return 4;
  return 5;
}

function getStep(date: string, status: string) {
  if (status === 'cancelled') return -1;
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
      color: ['#4ade80','#22c55e','#16a34a','#15803d','#86efac'][Math.floor(Math.random() * 5)],
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

function buildCancelEmail(name: string, orderId: string, reason: string, total: number): string {
  return [
    `Hi ${name},`,
    `Your order #${orderId} has been successfully cancelled.`,
    `Reason: ${reason}`,
    `Refund Amount: Rs. ${total.toFixed(2)}`,
    `Your refund will be credited to your original payment method within 24 hours.`,
    `If you have questions, contact us at devopspraharaj25@gmail.com`,
    `Team MetaMart`,
  ].join('\n\n');
}

function buildReturnEmail(name: string, orderId: string, type: string, reason: string, total: number): string {
  const isReplacement = type === 'replacement';
  const lines = [
    `Hi ${name},`,
    `We have received your ${isReplacement ? 'replacement' : 'return & refund'} request for order #${orderId}.`,
    `Request Type: ${isReplacement ? 'Replacement' : 'Refund'}`,
    `Reason: ${reason}`,
    isReplacement
      ? `What happens next:\n1. Pickup scheduled within 24 hours\n2. Item collected from your address\n3. Product inspected by our team\n4. Replacement dispatched within 2-3 business days`
      : `What happens next:\n1. Pickup scheduled within 24 hours\n2. Item collected from your address\n3. Product inspected by our team\n4. Refund of Rs. ${total.toFixed(2)} credited within 24 hours of pickup`,
    isReplacement
      ? `Your replacement will be dispatched within 2-3 business days after item pickup.`
      : `Refund Amount: Rs. ${total.toFixed(2)} — will be credited to your original payment method within 24 hours of item pickup.`,
    `If you have questions, contact us at devopspraharaj25@gmail.com`,
    `Team MetaMart`,
  ];
  return lines.join('\n\n');
}

export default function OrdersPage() {
  const { user, isLoaded } = useAppAuth();
  const { clearCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState<{ orderId: string; orderRef: string; email: string; name: string; total: number } | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);
  const [returnModal, setReturnModal] = useState<{ orderId: string; orderRef: string; email: string; name: string; total: number; createdAt: string } | null>(null);
  const [returnType, setReturnType] = useState<'refund' | 'replacement' | ''>('');
  const [returnReason, setReturnReason] = useState('');
  const [customReturnReason, setCustomReturnReason] = useState('');
  const [returning, setReturning] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState<string | null>(null);

  const handleReturn = async () => {
    if (!returnModal) return;
    const reason = returnReason === 'Other' ? customReturnReason.trim() : returnReason;
    if (!reason) return;
    setReturning(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: returnModal.orderRef, returnReason: reason, returnType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      if (!data.notificationSent) throw new Error('Your request was saved, but the email could not be sent. Check the mail provider setup.');
      if (!data.notificationSent) throw new Error('Your request was saved, but the email could not be sent. Check the mail provider setup and try again.');
      setReturnSuccess(returnModal.orderRef);
      setReturnModal(null);
      setReturnType('');
      setReturnReason('');
      setCustomReturnReason('');
      const email = user?.primaryEmailAddress?.emailAddress;
      if (email) fetchOrders(email);
    } catch (e: any) {
      alert(e.message ?? 'Failed to submit return. Please try again.');
    } finally {
      setReturning(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelModal) return;
    const reason = cancelReason === 'Other' ? customReason.trim() : cancelReason;
    if (!reason) return;
    setCancelling(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: cancelModal.orderRef, cancelReason: reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to cancel order.');
      if (!data.notificationSent) throw new Error('Your order was cancelled, but the email could not be sent. Check the mail provider setup.');
      if (!data.notificationSent) throw new Error('Your order was cancelled, but the email could not be sent. Check the mail provider setup.');
      setOrders(prev => prev.map(o => o.orderId === cancelModal.orderRef ? { ...o, status: 'cancelled' } : o));
      setCancelSuccess(cancelModal.orderRef);
      setCancelModal(null);
      setCancelReason('');
      setCustomReason('');
      const email = user?.primaryEmailAddress?.emailAddress;
      if (email) fetchOrders(email);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to cancel order. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const fetchOrders = (email: string) => {
    fetch(`/api/orders?email=${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (!isLoaded || !user) return;
    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('session_id')) {
      setIsNew(true);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 4000);
      clearCart();
      localStorage.removeItem('metamart_checkout_draft');
      sessionStorage.removeItem('metamart_payment_pending');
      window.history.replaceState({}, '', '/orders');
    }

    fetchOrders(email);
  }, [isLoaded, user]);

  if (!isLoaded || loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#08070d' }}>
      <Navbar />
      <div style={{ fontSize: '14px', color: '#a1a1aa' }}>Loading orders...</div>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#08070d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar />
      <p style={{ color: '#a1a1aa', marginBottom: '16px' }}>Please sign in to view your orders.</p>
      <Link href="/login" style={{ background: 'linear-gradient(135deg,#86efac,#16a34a)', color: 'white', padding: '12px 28px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#08070d 0%,#0d0b13 50%,#08070d 100%)' }}>
      <Confetti active={confetti} />
      <Navbar />

      {isNew && (
        <div style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', textAlign: 'center', padding: '14px', fontSize: '15px', fontWeight: 600 }}>
          🎉 Order placed successfully! Your items are on their way.
        </div>
      )}

      <div style={{ paddingTop: isNew ? '90px' : '110px', paddingBottom: '80px', maxWidth: '860px', margin: '0 auto' }} className="px-4 sm:px-6">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, background: 'linear-gradient(135deg,#22c55e,#15803d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '6px' }}>My Orders</h1>
          <p style={{ color: '#a1a1aa', fontSize: '15px' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} for {user.primaryEmailAddress?.emailAddress}</p>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#101610', borderRadius: '24px', boxShadow: '0 8px 40px rgba(0,0,0,0.3)', border: '1px solid rgba(74,222,128,.15)' }}>
            <div style={{ fontSize: '5rem', marginBottom: '16px' }}>📦</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f4f8f4', marginBottom: '8px' }}>No orders yet</h2>
            <p style={{ color: '#a1a1aa', marginBottom: '28px' }}>Start shopping to see your orders here</p>
            <Link href="/shop" style={{ background: 'linear-gradient(135deg,#86efac,#16a34a)', color: 'white', padding: '14px 36px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}>Shop Now</Link>
          </div>
        ) : (
          orders.map((order, idx) => {
            const step = getStep(order.createdAt, order.status);
            const isCancelled = order.status === 'cancelled';
            const isDelivered = step === 4;
            const isReturnRequested = order.status === 'return_requested' || order.status === 'replacement_requested';
            const isReplacement = order.status === 'replacement_requested';
            const daysLeft = daysLeftToReturn(order.createdAt);
            const canReturn = isDelivered && !isReturnRequested && daysLeft > 0;
            const isOpen = expanded === order._id;
            const receiptData = { id: order.orderId, items: order.items, total: order.total, address: order.address, name: order.userName, email: order.userEmail, date: order.createdAt, status: order.status };
            return (
              <div key={order._id} style={{ background: isCancelled ? '#1a0f0f' : '#101610', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', marginBottom: '16px', border: isCancelled ? '1.5px solid rgba(239,68,68,0.3)' : isOpen ? '1.5px solid #86efac' : '1px solid rgba(74,222,128,.15)', animation: `fadeUp 0.5s ease-out ${idx * 80}ms both` }}>

                {/* Return success banner — shown briefly after submitting */}
                {returnSuccess === order.orderId && (
                  <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>✅</span>
                    <span style={{ color: '#34d399', fontWeight: 600, fontSize: '14px' }}>
                      {returnType === 'replacement'
                        ? 'Replacement requested! We\'ll dispatch a new item after pickup.'
                        : `Return submitted! Refund of Rs. ${order.total.toFixed(2)} will be credited within 24 hours.`}
                    </span>
                  </div>
                )}

                {/* Cancelled banner */}
                {isCancelled && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>❌</span>
                    <span style={{ color: '#f87171', fontWeight: 600, fontSize: '14px' }}>Order Cancelled</span>
                    <span style={{ color: '#a1a1aa', fontSize: '13px', marginLeft: 'auto' }}>Refund within 24 hrs</span>
                  </div>
                )}

                {/* Success refund banner */}
                {cancelSuccess === order.orderId && (
                  <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>✅</span>
                    <span style={{ color: '#34d399', fontWeight: 600, fontSize: '14px' }}>Cancelled! Refund of Rs. {order.total.toFixed(2)} will be credited within 24 hours.</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                  <div><span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 500 }}>ORDER ID</span><br /><span style={{ fontWeight: 700, color: '#f4f8f4', fontSize: '14px' }}>{order.orderId}</span></div>
                  <div><span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 500 }}>PLACED ON</span><br /><span style={{ fontWeight: 600, color: '#f4f8f4', fontSize: '14px' }}>{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                  <div><span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 500 }}>TOTAL</span><br /><span style={{ fontWeight: 800, color: isCancelled ? '#f87171' : '#86efac', fontSize: '1.1rem' }}>Rs. {order.total.toFixed(2)}</span></div>
                  {!isCancelled && <div><span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 500 }}>DELIVERY BY</span><br /><span style={{ fontWeight: 700, color: '#10b981', fontSize: '14px' }}>🚚 {getArrival(order.createdAt)}</span></div>}
                  <button onClick={() => setExpanded(isOpen ? null : order._id)} style={{ background: isOpen ? '#f1f5f9' : 'linear-gradient(135deg,#22c55e,#15803d)', color: isOpen ? '#a1a1aa' : 'white', border: 'none', padding: '8px 22px', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>{isOpen ? '▲ Hide' : '▼ Details'}</button>
                  <button onClick={() => downloadReceipt(receiptData)} style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>⬇ Receipt</button>
                  {!isCancelled && !isDelivered && (
                    <button onClick={() => { setCancelModal({ orderId: order._id, orderRef: order.orderId, email: order.userEmail, name: order.userName, total: order.total }); setCancelReason(''); setCustomReason(''); }}
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', padding: '8px 18px', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                      ❌ Cancel Order
                    </button>
                  )}
                  {canReturn && (
                    <button onClick={() => { setReturnModal({ orderId: order._id, orderRef: order.orderId, email: order.userEmail, name: order.userName, total: order.total, createdAt: order.createdAt }); setReturnType(''); setReturnReason(''); setCustomReturnReason(''); }}
                      style={{ background: 'rgba(34,197,94,0.1)', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)', padding: '8px 18px', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                      🔄 Return · {daysLeft}d left
                    </button>
                  )}
                </div>

                {/* Stepper — delivery or return depending on status */}
                {!isCancelled && !isReturnRequested && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', padding: '16px 0', overflowX: 'auto' }}>
                    {STEPS.map((s, i) => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: i <= step ? 'linear-gradient(135deg,#22c55e,#15803d)' : '#171e18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i <= step ? '18px' : '14px', fontWeight: 700, color: i <= step ? 'white' : '#a1a1aa', boxShadow: i === step ? '0 0 0 4px rgba(34,197,94,0.2)' : 'none', flexShrink: 0 }}>
                            {i < step ? '✓' : STEP_ICONS[i]}
                          </div>
                          <span style={{ fontSize: '10px', color: i <= step ? '#22c55e' : '#a1a1aa', fontWeight: i <= step ? 700 : 400, textAlign: 'center', width: '64px', lineHeight: 1.3 }}>{s}</span>
                        </div>
                        {i < STEPS.length - 1 && <div style={{ flex: 1, height: '3px', background: i < step ? 'linear-gradient(90deg,#22c55e,#15803d)' : '#171e18', margin: '0 4px', marginBottom: '28px', borderRadius: '2px' }} />}
                      </div>
                    ))}
                  </div>
                )}

                {/* Return stepper */}
                {isReturnRequested && order.returnRequestedAt && (() => {
                  const rStep = getReturnStep(order.returnRequestedAt!);
                  const steps = isReplacement ? REPLACEMENT_STEPS : RETURN_STEPS;
                  const icons = isReplacement ? REPLACEMENT_STEP_ICONS : RETURN_STEP_ICONS;
                  const accentColor = isReplacement ? '#22c55e' : '#86efac';
                  const accentGlow = isReplacement ? 'rgba(34,197,94,0.25)' : 'rgba(74,222,128,0.25)';
                  const gradientBar = isReplacement ? 'linear-gradient(90deg,#22c55e,#15803d)' : 'linear-gradient(90deg,#4ade80,#16a34a)';
                  const gradientCircle = isReplacement ? 'linear-gradient(135deg,#22c55e,#15803d)' : 'linear-gradient(135deg,#4ade80,#16a34a)';
                  return (
                    <div>
                      <p style={{ fontSize: '11px', color: accentColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '4px' }}>
                        {isReplacement ? '🔁 Replacement in Progress' : '🔄 Return in Progress'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: '8px' }}>
                        {steps.map((s, i) => (
                          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: i <= rStep ? gradientCircle : '#171e18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i <= rStep ? '16px' : '13px', fontWeight: 700, color: i <= rStep ? 'white' : '#a1a1aa', boxShadow: i === rStep ? `0 0 0 4px ${accentGlow}` : 'none', flexShrink: 0 }}>
                                {i < rStep ? '✓' : icons[i]}
                              </div>
                              <span style={{ fontSize: '9px', color: i <= rStep ? accentColor : '#a1a1aa', fontWeight: i <= rStep ? 700 : 400, textAlign: 'center', width: '60px', lineHeight: 1.3 }}>{s}</span>
                            </div>
                            {i < steps.length - 1 && <div style={{ flex: 1, height: '3px', background: i < rStep ? gradientBar : '#171e18', margin: '0 4px', marginBottom: '26px', borderRadius: '2px' }} />}
                          </div>
                        ))}
                      </div>
                      {rStep === 5 && (
                        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '10px 14px', marginTop: '8px', fontSize: '13px', color: '#34d399' }}>
                          {isReplacement
                            ? '🏠 Your replacement has been delivered!'
                            : `✅ Refund of Rs. ${order.total.toFixed(2)} has been credited to your original payment method.`}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {isOpen && (
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                    <div className="orders-detail-grid">
                      <div style={{ background: '#171e18', borderRadius: '14px', padding: '18px' }}>
                        <p style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>📍 Delivery Address</p>
                        <p style={{ fontWeight: 700, color: '#f4f8f4', fontSize: '14px', marginBottom: '4px' }}>{order.userName}</p>
                        <p style={{ color: '#a1a1aa', fontSize: '13px' }}>{order.address}</p>
                      </div>
                      <div style={{ background: '#171e18', borderRadius: '14px', padding: '18px' }}>
                        <p style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase' }}>🛍️ Items</p>
                        {order.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                            <div>
                              <p style={{ fontSize: '13px', fontWeight: 600, color: '#f4f8f4', marginBottom: '2px' }}>{item.name}</p>
                              <p style={{ fontSize: '12px', color: '#a1a1aa' }}>Qty: {item.quantity} · <span style={{ color: '#86efac', fontWeight: 600 }}>Rs. {(item.price * item.quantity).toFixed(2)}</span></p>
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

      {/* Return Order Modal */}
      {returnModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={e => { if (e.target === e.currentTarget) setReturnModal(null); }}>
          <div style={{ background: '#101610', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f4f8f4', marginBottom: '6px' }}>🔄 Return Order</h2>
            <p style={{ color: '#a1a1aa', fontSize: '13px', marginBottom: '20px' }}>Order #{returnModal.orderRef} · Rs. {returnModal.total.toFixed(2)} · {daysLeftToReturn(returnModal.createdAt)} days left</p>

            {/* Step 1 — Refund or Replacement */}
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '10px' }}>What would you like?</p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {(['refund', 'replacement'] as const).map(t => (
                <button key={t} onClick={() => { setReturnType(t); setReturnReason(''); setCustomReturnReason(''); }}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: returnType === t ? '2px solid #22c55e' : '1px solid rgba(255,255,255,0.08)', background: returnType === t ? 'rgba(34,197,94,0.12)' : '#171e18', color: returnType === t ? '#86efac' : '#a1a1aa', fontWeight: 700, cursor: 'pointer', fontSize: '14px', textTransform: 'capitalize' }}>
                  {t === 'refund' ? '💰 Refund' : '🔁 Replacement'}
                </button>
              ))}
            </div>

            {/* Step 2 — Reason (shown after type selected) */}
            {returnType && (
              <>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '10px' }}>Why are you returning?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {RETURN_REASONS.map(r => (
                    <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', background: returnReason === r ? 'rgba(34,197,94,0.1)' : '#171e18', border: returnReason === r ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                      <input type="radio" name="returnReason" value={r} checked={returnReason === r} onChange={() => setReturnReason(r)} style={{ accentColor: '#22c55e' }} />
                      <span style={{ fontSize: '13px', color: '#f4f8f4' }}>{r}</span>
                    </label>
                  ))}
                </div>
                {returnReason === 'Other' && (
                  <textarea value={customReturnReason} onChange={e => setCustomReturnReason(e.target.value)}
                    placeholder="Please describe your reason..."
                    rows={3}
                    style={{ width: '100%', background: '#171e18', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 12px', color: '#f4f8f4', fontSize: '13px', resize: 'none', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }}
                  />
                )}
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', fontSize: '13px', color: '#34d399' }}>
                  {returnType === 'refund' ? `💰 Refund of Rs. ${returnModal.total.toFixed(2)} will be credited within 24 hours of item pickup.` : '🔁 Replacement will be dispatched within 2–3 business days after item pickup.'}
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setReturnModal(null)}
                style={{ flex: 1, padding: '12px', borderRadius: '50px', background: '#171e18', border: '1px solid rgba(255,255,255,0.1)', color: '#a1a1aa', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                Keep Item
              </button>
              <button onClick={handleReturn}
                disabled={returning || !returnType || !returnReason || (returnReason === 'Other' && !customReturnReason.trim())}
                style={{ flex: 1, padding: '12px', borderRadius: '50px', background: returning ? '#14532d' : 'linear-gradient(135deg,#4ade80,#15803d)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '14px', opacity: (!returnType || !returnReason || (returnReason === 'Other' && !customReturnReason.trim())) ? 0.5 : 1 }}>
                {returning ? 'Submitting...' : `Confirm ${returnType === 'replacement' ? 'Replacement' : 'Return'}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={e => { if (e.target === e.currentTarget) setCancelModal(null); }}>
          <div style={{ background: '#101610', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f4f8f4', marginBottom: '6px' }}>❌ Cancel Order</h2>
            <p style={{ color: '#a1a1aa', fontSize: '13px', marginBottom: '20px' }}>Order #{cancelModal.orderRef} · Rs. {cancelModal.total.toFixed(2)}</p>

            <p style={{ fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '10px' }}>Why are you cancelling?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {CANCEL_REASONS.map(r => (
                <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', background: cancelReason === r ? 'rgba(239,68,68,0.1)' : '#171e18', border: cancelReason === r ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                  <input type="radio" name="reason" value={r} checked={cancelReason === r} onChange={() => setCancelReason(r)} style={{ accentColor: '#ef4444' }} />
                  <span style={{ fontSize: '13px', color: '#f4f8f4' }}>{r}</span>
                </label>
              ))}
            </div>

            {cancelReason === 'Other' && (
              <textarea value={customReason} onChange={e => setCustomReason(e.target.value)}
                placeholder="Please describe your reason..."
                rows={3}
                style={{ width: '100%', background: '#171e18', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 12px', color: '#f4f8f4', fontSize: '13px', resize: 'none', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }}
              />
            )}

            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', fontSize: '13px', color: '#34d399' }}>
              💰 Refund of Rs. {cancelModal.total.toFixed(2)} will be credited within 24 hours.
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setCancelModal(null)}
                style={{ flex: 1, padding: '12px', borderRadius: '50px', background: '#171e18', border: '1px solid rgba(255,255,255,0.1)', color: '#a1a1aa', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                Keep Order
              </button>
              <button onClick={handleCancel}
                disabled={cancelling || !cancelReason || (cancelReason === 'Other' && !customReason.trim())}
                style={{ flex: 1, padding: '12px', borderRadius: '50px', background: cancelling ? '#7f1d1d' : 'linear-gradient(135deg,#ef4444,#b91c1c)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '14px', opacity: (!cancelReason || (cancelReason === 'Other' && !customReason.trim())) ? 0.5 : 1 }}>
                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .orders-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) { .orders-detail-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
