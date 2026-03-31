'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

const fields = [
  { name: 'name', placeholder: 'Full Name', type: 'text', icon: '👤' },
  { name: 'email', placeholder: 'Email Address', type: 'email', icon: '📧' },
  { name: 'phone', placeholder: 'Phone Number', type: 'tel', icon: '📱' },
  { name: 'address', placeholder: 'Street Address', type: 'text', icon: '🏠' },
  { name: 'city', placeholder: 'City', type: 'text', icon: '🏙️' },
  { name: 'pincode', placeholder: 'PIN / ZIP Code', type: 'text', icon: '📮' },
];

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    const pendingOrder = {
      id: `ORD${Date.now()}`,
      items, total,
      address: `${form.address}, ${form.city} - ${form.pincode}`,
      name: form.name, email: form.email,
      date: new Date().toISOString(),
      status: 'confirmed',
    };
    localStorage.setItem('mm_pending_order', JSON.stringify(pendingOrder));
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, address: form }),
      });
      const { url } = await res.json();
      clearCart();
      window.location.href = url;
    } catch {
      setLoading(false);
    }
  };

  if (items.length === 0) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0f4ff,#faf5ff)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Your cart is empty</h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>Add items before checking out</p>
        <Link href="/shop" style={{ background: 'linear-gradient(135deg,#3b82f6,#9333ea)', color: 'white', padding: '14px 32px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none' }}>Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0f4ff 0%,#faf5ff 50%,#f0fdf4 100%)' }}>
      <Navbar />
      <div style={{ paddingTop: '110px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', maxWidth: '1000px', margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '14px', color: '#94a3b8' }}>
          <Link href="/cart" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>Cart</Link>
          <span>›</span>
          <span style={{ color: '#1e293b', fontWeight: 600 }}>Checkout</span>
          <span>›</span>
          <span>Payment</span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg,#3b82f6,#9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '28px' }}>
          Checkout
        </h1>

        <form onSubmit={handlePayment} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', alignItems: 'start' }}>

          {/* Address */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(59,130,246,0.08)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📦 Delivery Address
            </h2>
            {fields.map(f => (
              <div key={f.name} style={{ position: 'relative', marginBottom: '14px' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none' }}>{f.icon}</span>
                <input
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={(form as any)[f.name]}
                  onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                  onFocus={() => setFocused(f.name)}
                  onBlur={() => setFocused('')}
                  required
                  style={{ width: '100%', padding: '13px 16px 13px 42px', border: `2px solid ${focused === f.name ? '#3b82f6' : '#e5e7eb'}`, borderRadius: '12px', fontSize: '14px', outline: 'none', color: '#1e293b', background: focused === f.name ? 'white' : '#f9fafb', boxSizing: 'border-box', transition: 'all 0.2s ease', boxShadow: focused === f.name ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none' }}
                />
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', position: 'sticky', top: '100px', border: '1px solid rgba(59,130,246,0.08)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>🧾 Order Summary</h2>

            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', flexShrink: 0 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr style={{ borderColor: '#f1f5f9', margin: '16px 0' }} />
            {[['Subtotal', `$${subtotal.toFixed(2)}`], ['Shipping', shipping === 0 ? '🎉 Free' : `$${shipping.toFixed(2)}`], ['Tax (8%)', `$${tax.toFixed(2)}`]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>{k}</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{v}</span>
              </div>
            ))}
            <hr style={{ borderColor: '#f1f5f9', margin: '16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#3b82f6', marginBottom: '20px' }}>
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', background: loading ? '#94a3b8' : 'linear-gradient(135deg,#3b82f6,#9333ea)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? (
                <><span style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Redirecting...</>
              ) : `🔒 Pay $${total.toFixed(2)}`}
            </button>
            <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>Secured by Stripe · 256-bit SSL</p>
          </div>
        </form>
      </div>
      <Footer />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
