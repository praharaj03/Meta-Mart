'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '../../context/CartContext';

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '' });
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    // Save pending order to localStorage before redirecting
    const pendingOrder = {
      id: `ORD${Date.now()}`,
      items,
      total,
      address: `${form.address}, ${form.city} - ${form.pincode}`,
      name: form.name,
      email: form.email,
      date: new Date().toISOString(),
      status: 'confirmed',
    };
    localStorage.setItem('mm_pending_order', JSON.stringify(pendingOrder));

    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, address: form }),
    });

    const { url } = await res.json();
    clearCart();
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar />
      <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(135deg,#3b82f6,#9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '32px' }}>
          Checkout
        </h1>

        <form onSubmit={handlePayment} style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
          {/* Address Form */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>📦 Delivery Address</h2>
            {[
              { name: 'name', placeholder: 'Full Name', type: 'text' },
              { name: 'email', placeholder: 'Email Address', type: 'email' },
              { name: 'phone', placeholder: 'Phone Number', type: 'tel' },
              { name: 'address', placeholder: 'Street Address', type: 'text' },
              { name: 'city', placeholder: 'City', type: 'text' },
              { name: 'pincode', placeholder: 'PIN / ZIP Code', type: 'text' },
            ].map(f => (
              <input
                key={f.name}
                name={f.name}
                type={f.type}
                placeholder={f.placeholder}
                value={(form as any)[f.name]}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '15px', marginBottom: '16px', outline: 'none', color: '#1e293b', background: '#f9fafb', boxSizing: 'border-box' }}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>🧾 Order Summary</h2>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#374151' }}>
                <span>{item.name} × {item.quantity}</span>
                <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr style={{ margin: '16px 0', borderColor: '#e5e7eb' }} />
            {[['Subtotal', `$${subtotal.toFixed(2)}`], ['Shipping', shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`], ['Tax (8%)', `$${tax.toFixed(2)}`]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#64748b' }}>
                <span>{k}</span><span>{v}</span>
              </div>
            ))}
            <hr style={{ margin: '16px 0', borderColor: '#e5e7eb' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#3b82f6', marginBottom: '24px' }}>
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
            <button
              type="submit"
              disabled={loading || items.length === 0}
              style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg,#3b82f6,#9333ea)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Redirecting to Stripe...' : `Pay $${total.toFixed(2)}`}
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '12px' }}>🔒 Secured by Stripe</p>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
