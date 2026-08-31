'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
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

function buildCancelEmail(name: string, orderId: string, reason: string, total: number): string {
  return `
<div style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f7;padding:32px 0;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a0a2e,#3b1a6b);padding:36px 40px;text-align:center;">
      <div style="font-size:40px;margin-bottom:12px;">&#10060;</div>
      <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0 0 6px;">Order Cancelled</h1>
      <p style="color:#c4b5fd;font-size:14px;margin:0;">We\'ve received your cancellation request</p>
    </div>
    <!-- Body -->
    <div style="padding:36px 40px;">
      <p style="color:#374151;font-size:15px;margin:0 0 24px;">Hi <strong>${name}</strong>,</p>
      <p style="color:#374151;font-size:15px;margin:0 0 24px;">Your order has been successfully cancelled. Here\'s a summary:</p>
      <!-- Order Details Box -->
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Order ID</td><td style="padding:6px 0;color:#111827;font-size:13px;font-weight:700;text-align:right;">#${orderId}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Cancellation Reason</td><td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;text-align:right;">${reason}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Refund Amount</td><td style="padding:6px 0;color:#7c3aed;font-size:15px;font-weight:800;text-align:right;">₹${total.toFixed(2)}</td></tr>
        </table>
      </div>
      <!-- Refund Banner -->
      <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:10px;padding:16px 20px;margin-bottom:24px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:24px;">&#128176;</span>
        <div>
          <p style="color:#065f46;font-size:14px;font-weight:700;margin:0 0 2px;">Refund Initiated</p>
          <p style="color:#047857;font-size:13px;margin:0;">&#8377;${total.toFixed(2)} will be credited to your original payment method within <strong>24 hours</strong>.</p>
        </div>
      </div>
      <p style="color:#6b7280;font-size:13px;margin:0 0 8px;">If you have any questions, feel free to reach out to us:</p>
      <p style="margin:0;"><a href="mailto:devopspraharaj25@gmail.com" style="color:#7c3aed;font-size:13px;font-weight:600;">devopspraharaj25@gmail.com</a></p>
    </div>
    <!-- Footer -->
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0 0 4px;">&#169; ${new Date().getFullYear()} MetaMart. All rights reserved.</p>
      <p style="color:#9ca3af;font-size:12px;margin:0;">This is an automated email. Please do not reply directly.</p>
    </div>
  </div>
</div>`;
}

function buildReturnEmail(name: string, orderId: string, type: string, reason: string, total: number): string {
  const isReplacement = type === 'replacement';
  const accent = isReplacement ? '#3b82f6' : '#d97706';
  const headerBg = isReplacement ? 'linear-gradient(135deg,#0c1a3a,#1e3a8a)' : 'linear-gradient(135deg,#1c1107,#78350f)';
  const title = isReplacement ? '&#128260; Replacement Requested' : '&#128260; Return Request Received';
  const subtitle = isReplacement ? "We'll send a replacement once we receive your item" : "We'll arrange a pickup at your earliest convenience";
  const steps = isReplacement
    ? ['Pickup scheduled within 24 hours','Our team collects the item from your address','Item inspected by our quality team','Replacement dispatched within 2–3 business days']
    : ['Pickup scheduled within 24 hours','Our team collects the item from your address','Item inspected by our quality team','Refund processed upon approval'];
  const timeline = isReplacement
    ? 'Your replacement will be dispatched within 2–3 business days after item pickup.'
    : `&#8377;${total.toFixed(2)} will be credited to your original payment method within <strong>24 hours</strong> of item pickup.`;
  return `<div style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f7;padding:32px 0;"><div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);"><div style="background:${headerBg};padding:36px 40px;text-align:center;"><div style="font-size:40px;margin-bottom:12px;">${title.split(' ')[0]}</div><h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0 0 6px;">${title.substring(title.indexOf(' ')+1)}</h1><p style="color:#fde68a;font-size:14px;margin:0;">${subtitle}</p></div><div style="padding:36px 40px;"><p style="color:#374151;font-size:15px;margin:0 0 24px;">Hi <strong>${name}</strong>,</p><p style="color:#374151;font-size:15px;margin:0 0 24px;">We've received your ${isReplacement ? 'replacement' : 'return'} request. Here's what happens next:</p><div style="margin-bottom:24px;">${steps.map((s,i)=>`<div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:14px;"><div style="width:28px;height:28px;border-radius:50%;background:${accent};color:white;font-size:12px;font-weight:800;text-align:center;line-height:28px;flex-shrink:0;">${i+1}</div><p style="color:#374151;font-size:14px;margin:4px 0 0;">${s}</p></div>`).join('')}</div><div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;margin-bottom:24px;"><table style="width:100%;border-collapse:collapse;"><tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Order ID</td><td style="padding:6px 0;color:#111827;font-size:13px;font-weight:700;text-align:right;">#${orderId}</td></tr><tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Request Type</td><td style="padding:6px 0;font-size:13px;font-weight:700;text-align:right;color:${accent};">${isReplacement ? 'Replacement' : 'Refund'}</td></tr><tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Reason</td><td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;text-align:right;">${reason}</td></tr>${!isReplacement ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Refund Amount</td><td style="padding:6px 0;color:${accent};font-size:15px;font-weight:800;text-align:right;">&#8377;${total.toFixed(2)}</td></tr>` : ''}</table></div><div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:10px;padding:16px 20px;margin-bottom:24px;"><p style="color:#065f46;font-size:14px;font-weight:700;margin:0 0 4px;">&#128176; ${isReplacement ? 'Replacement' : 'Refund'} Timeline</p><p style="color:#047857;font-size:13px;margin:0;">${timeline}</p></div><p style="color:#6b7280;font-size:13px;margin:0 0 8px;">Need help? Contact us at:</p><p style="margin:0;"><a href="mailto:devopspraharaj25@gmail.com" style="color:${accent};font-size:13px;font-weight:600;">devopspraharaj25@gmail.com</a></p></div><div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;"><p style="color:#9ca3af;font-size:12px;margin:0 0 4px;">&#169; ${new Date().getFullYear()} MetaMart. All rights reserved.</p><p style="color:#9ca3af;font-size:12px;margin:0;">This is an automated email. Please do not reply directly.</p></div></div></div>`;
}

export default function OrdersPage() {
  const { user, isLoaded } = useUser();
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
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: returnModal.email,
          to_name: returnModal.name,
          order_id: returnModal.orderRef,
          cancel_reason: reason,
          refund_amount: `₹${returnModal.total.toFixed(2)}`,
          message: buildReturnEmail(returnModal.name, returnModal.orderRef, returnType, reason, returnModal.total),
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
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
      if (!res.ok) throw new Error();
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: cancelModal.email,
          to_name: cancelModal.name,
          order_id: cancelModal.orderRef,
          cancel_reason: reason,
          refund_amount: `₹${cancelModal.total.toFixed(2)}`,
          message: buildCancelEmail(cancelModal.name, cancelModal.orderRef, reason, cancelModal.total),
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setOrders(prev => prev.map(o => o.orderId === cancelModal.orderRef ? { ...o, status: 'cancelled' } : o));
      setCancelSuccess(cancelModal.orderRef);
      setCancelModal(null);
      setCancelReason('');
      setCustomReason('');
      const email = user?.primaryEmailAddress?.emailAddress;
      if (email) fetchOrders(email);
    } catch {
      alert('Failed to cancel order. Please try again.');
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
      <div style={{ fontSize: '14px', color: '#b7aec8' }}>Loading orders...</div>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#08070d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar />
      <p style={{ color: '#b7aec8', marginBottom: '16px' }}>Please sign in to view your orders.</p>
      <Link href="/login" style={{ background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: 'white', padding: '12px 28px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
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
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, background: 'linear-gradient(135deg,#3b82f6,#9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '6px' }}>My Orders</h1>
          <p style={{ color: '#b7aec8', fontSize: '15px' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} for {user.primaryEmailAddress?.emailAddress}</p>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#13111b', borderRadius: '24px', boxShadow: '0 8px 40px rgba(0,0,0,0.3)', border: '1px solid rgba(192,132,252,.15)' }}>
            <div style={{ fontSize: '5rem', marginBottom: '16px' }}>📦</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f7f4ff', marginBottom: '8px' }}>No orders yet</h2>
            <p style={{ color: '#b7aec8', marginBottom: '28px' }}>Start shopping to see your orders here</p>
            <Link href="/shop" style={{ background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: 'white', padding: '14px 36px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}>Shop Now</Link>
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
              <div key={order._id} style={{ background: isCancelled ? '#1a0f0f' : '#13111b', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', marginBottom: '16px', border: isCancelled ? '1.5px solid rgba(239,68,68,0.3)' : isOpen ? '1.5px solid #c084fc' : '1px solid rgba(192,132,252,.15)', animation: `fadeUp 0.5s ease-out ${idx * 80}ms both` }}>

                {/* Return success banner — shown briefly after submitting */}
                {returnSuccess === order.orderId && (
                  <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>✅</span>
                    <span style={{ color: '#34d399', fontWeight: 600, fontSize: '14px' }}>
                      {returnType === 'replacement'
                        ? 'Replacement requested! We\'ll dispatch a new item after pickup.'
                        : `Return submitted! Refund of ₹${order.total.toFixed(2)} will be credited within 24 hours.`}
                    </span>
                  </div>
                )}

                {/* Cancelled banner */}
                {isCancelled && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>❌</span>
                    <span style={{ color: '#f87171', fontWeight: 600, fontSize: '14px' }}>Order Cancelled</span>
                    <span style={{ color: '#94a3b8', fontSize: '13px', marginLeft: 'auto' }}>Refund within 24 hrs</span>
                  </div>
                )}

                {/* Success refund banner */}
                {cancelSuccess === order.orderId && (
                  <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>✅</span>
                    <span style={{ color: '#34d399', fontWeight: 600, fontSize: '14px' }}>Cancelled! Refund of ₹{order.total.toFixed(2)} will be credited within 24 hours.</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                  <div><span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>ORDER ID</span><br /><span style={{ fontWeight: 700, color: '#f7f4ff', fontSize: '14px' }}>{order.orderId}</span></div>
                  <div><span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>PLACED ON</span><br /><span style={{ fontWeight: 600, color: '#f7f4ff', fontSize: '14px' }}>{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                  <div><span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>TOTAL</span><br /><span style={{ fontWeight: 800, color: isCancelled ? '#f87171' : '#c084fc', fontSize: '1.1rem' }}>₹{order.total.toFixed(2)}</span></div>
                  {!isCancelled && <div><span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>DELIVERY BY</span><br /><span style={{ fontWeight: 700, color: '#10b981', fontSize: '14px' }}>🚚 {getArrival(order.createdAt)}</span></div>}
                  <button onClick={() => setExpanded(isOpen ? null : order._id)} style={{ background: isOpen ? '#f1f5f9' : 'linear-gradient(135deg,#3b82f6,#9333ea)', color: isOpen ? '#64748b' : 'white', border: 'none', padding: '8px 22px', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>{isOpen ? '▲ Hide' : '▼ Details'}</button>
                  <button onClick={() => downloadReceipt(receiptData)} style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>⬇ Receipt</button>
                  {!isCancelled && !isDelivered && (
                    <button onClick={() => { setCancelModal({ orderId: order._id, orderRef: order.orderId, email: order.userEmail, name: order.userName, total: order.total }); setCancelReason(''); setCustomReason(''); }}
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', padding: '8px 18px', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                      ❌ Cancel Order
                    </button>
                  )}
                  {canReturn && (
                    <button onClick={() => { setReturnModal({ orderId: order._id, orderRef: order.orderId, email: order.userEmail, name: order.userName, total: order.total, createdAt: order.createdAt }); setReturnType(''); setReturnReason(''); setCustomReturnReason(''); }}
                      style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)', padding: '8px 18px', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
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
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: i <= step ? 'linear-gradient(135deg,#3b82f6,#9333ea)' : '#1e1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i <= step ? '18px' : '14px', fontWeight: 700, color: i <= step ? 'white' : '#94a3b8', boxShadow: i === step ? '0 0 0 4px rgba(59,130,246,0.2)' : 'none', flexShrink: 0 }}>
                            {i < step ? '✓' : STEP_ICONS[i]}
                          </div>
                          <span style={{ fontSize: '10px', color: i <= step ? '#3b82f6' : '#94a3b8', fontWeight: i <= step ? 700 : 400, textAlign: 'center', width: '64px', lineHeight: 1.3 }}>{s}</span>
                        </div>
                        {i < STEPS.length - 1 && <div style={{ flex: 1, height: '3px', background: i < step ? 'linear-gradient(90deg,#3b82f6,#9333ea)' : '#1e1a2e', margin: '0 4px', marginBottom: '28px', borderRadius: '2px' }} />}
                      </div>
                    ))}
                  </div>
                )}

                {/* Return stepper */}
                {isReturnRequested && order.returnRequestedAt && (() => {
                  const rStep = getReturnStep(order.returnRequestedAt!);
                  const steps = isReplacement ? REPLACEMENT_STEPS : RETURN_STEPS;
                  const icons = isReplacement ? REPLACEMENT_STEP_ICONS : RETURN_STEP_ICONS;
                  const accentColor = isReplacement ? '#3b82f6' : '#f59e0b';
                  const accentGlow = isReplacement ? 'rgba(59,130,246,0.25)' : 'rgba(245,158,11,0.25)';
                  const gradientBar = isReplacement ? 'linear-gradient(90deg,#3b82f6,#6366f1)' : 'linear-gradient(90deg,#f59e0b,#d97706)';
                  const gradientCircle = isReplacement ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : 'linear-gradient(135deg,#f59e0b,#d97706)';
                  return (
                    <div>
                      <p style={{ fontSize: '11px', color: accentColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '4px' }}>
                        {isReplacement ? '🔁 Replacement in Progress' : '🔄 Return in Progress'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: '8px' }}>
                        {steps.map((s, i) => (
                          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: i <= rStep ? gradientCircle : '#1e1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i <= rStep ? '16px' : '13px', fontWeight: 700, color: i <= rStep ? 'white' : '#94a3b8', boxShadow: i === rStep ? `0 0 0 4px ${accentGlow}` : 'none', flexShrink: 0 }}>
                                {i < rStep ? '✓' : icons[i]}
                              </div>
                              <span style={{ fontSize: '9px', color: i <= rStep ? accentColor : '#94a3b8', fontWeight: i <= rStep ? 700 : 400, textAlign: 'center', width: '60px', lineHeight: 1.3 }}>{s}</span>
                            </div>
                            {i < steps.length - 1 && <div style={{ flex: 1, height: '3px', background: i < rStep ? gradientBar : '#1e1a2e', margin: '0 4px', marginBottom: '26px', borderRadius: '2px' }} />}
                          </div>
                        ))}
                      </div>
                      {rStep === 5 && (
                        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '10px 14px', marginTop: '8px', fontSize: '13px', color: '#34d399' }}>
                          {isReplacement
                            ? '🏠 Your replacement has been delivered!'
                            : `✅ Refund of ₹${order.total.toFixed(2)} has been credited to your original payment method.`}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {isOpen && (
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                    <div className="orders-detail-grid">
                      <div style={{ background: '#1e1a2e', borderRadius: '14px', padding: '18px' }}>
                        <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>📍 Delivery Address</p>
                        <p style={{ fontWeight: 700, color: '#f7f4ff', fontSize: '14px', marginBottom: '4px' }}>{order.userName}</p>
                        <p style={{ color: '#b7aec8', fontSize: '13px' }}>{order.address}</p>
                      </div>
                      <div style={{ background: '#1e1a2e', borderRadius: '14px', padding: '18px' }}>
                        <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase' }}>🛍️ Items</p>
                        {order.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                            <div>
                              <p style={{ fontSize: '13px', fontWeight: 600, color: '#f7f4ff', marginBottom: '2px' }}>{item.name}</p>
                              <p style={{ fontSize: '12px', color: '#b7aec8' }}>Qty: {item.quantity} · <span style={{ color: '#c084fc', fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span></p>
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
          <div style={{ background: '#13111b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f7f4ff', marginBottom: '6px' }}>🔄 Return Order</h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>Order #{returnModal.orderRef} · ₹{returnModal.total.toFixed(2)} · {daysLeftToReturn(returnModal.createdAt)} days left</p>

            {/* Step 1 — Refund or Replacement */}
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#b7aec8', marginBottom: '10px' }}>What would you like?</p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {(['refund', 'replacement'] as const).map(t => (
                <button key={t} onClick={() => { setReturnType(t); setReturnReason(''); setCustomReturnReason(''); }}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: returnType === t ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)', background: returnType === t ? 'rgba(245,158,11,0.12)' : '#1e1a2e', color: returnType === t ? '#fbbf24' : '#94a3b8', fontWeight: 700, cursor: 'pointer', fontSize: '14px', textTransform: 'capitalize' }}>
                  {t === 'refund' ? '💰 Refund' : '🔁 Replacement'}
                </button>
              ))}
            </div>

            {/* Step 2 — Reason (shown after type selected) */}
            {returnType && (
              <>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#b7aec8', marginBottom: '10px' }}>Why are you returning?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {RETURN_REASONS.map(r => (
                    <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', background: returnReason === r ? 'rgba(245,158,11,0.1)' : '#1e1a2e', border: returnReason === r ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                      <input type="radio" name="returnReason" value={r} checked={returnReason === r} onChange={() => setReturnReason(r)} style={{ accentColor: '#f59e0b' }} />
                      <span style={{ fontSize: '13px', color: '#f7f4ff' }}>{r}</span>
                    </label>
                  ))}
                </div>
                {returnReason === 'Other' && (
                  <textarea value={customReturnReason} onChange={e => setCustomReturnReason(e.target.value)}
                    placeholder="Please describe your reason..."
                    rows={3}
                    style={{ width: '100%', background: '#1e1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 12px', color: '#f7f4ff', fontSize: '13px', resize: 'none', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }}
                  />
                )}
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', fontSize: '13px', color: '#34d399' }}>
                  {returnType === 'refund' ? `💰 Refund of ₹${returnModal.total.toFixed(2)} will be credited within 24 hours of item pickup.` : '🔁 Replacement will be dispatched within 2–3 business days after item pickup.'}
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setReturnModal(null)}
                style={{ flex: 1, padding: '12px', borderRadius: '50px', background: '#1e1a2e', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                Keep Item
              </button>
              <button onClick={handleReturn}
                disabled={returning || !returnType || !returnReason || (returnReason === 'Other' && !customReturnReason.trim())}
                style={{ flex: 1, padding: '12px', borderRadius: '50px', background: returning ? '#78350f' : 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '14px', opacity: (!returnType || !returnReason || (returnReason === 'Other' && !customReturnReason.trim())) ? 0.5 : 1 }}>
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
          <div style={{ background: '#13111b', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f7f4ff', marginBottom: '6px' }}>❌ Cancel Order</h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>Order #{cancelModal.orderRef} · ₹{cancelModal.total.toFixed(2)}</p>

            <p style={{ fontSize: '13px', fontWeight: 600, color: '#b7aec8', marginBottom: '10px' }}>Why are you cancelling?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {CANCEL_REASONS.map(r => (
                <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', background: cancelReason === r ? 'rgba(239,68,68,0.1)' : '#1e1a2e', border: cancelReason === r ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                  <input type="radio" name="reason" value={r} checked={cancelReason === r} onChange={() => setCancelReason(r)} style={{ accentColor: '#ef4444' }} />
                  <span style={{ fontSize: '13px', color: '#f7f4ff' }}>{r}</span>
                </label>
              ))}
            </div>

            {cancelReason === 'Other' && (
              <textarea value={customReason} onChange={e => setCustomReason(e.target.value)}
                placeholder="Please describe your reason..."
                rows={3}
                style={{ width: '100%', background: '#1e1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 12px', color: '#f7f4ff', fontSize: '13px', resize: 'none', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }}
              />
            )}

            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', fontSize: '13px', color: '#34d399' }}>
              💰 Refund of ₹{cancelModal.total.toFixed(2)} will be credited within 24 hours.
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setCancelModal(null)}
                style={{ flex: 1, padding: '12px', borderRadius: '50px', background: '#1e1a2e', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
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
