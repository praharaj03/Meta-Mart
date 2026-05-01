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
  const { items } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [payMethod, setPayMethod] = useState<'stripe' | 'upi'>('stripe');
  const [upiApp, setUpiApp] = useState('');
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const [upiPopup, setUpiPopup] = useState(false);

  const UPI_APPS = [
    {
      id: 'gpay', label: 'Google Pay', color: '#4285F4',
      icon: <img src="https://cdn.simpleicons.org/googlepay/4285F4" alt="Google Pay" width="36" height="36" style={{ objectFit: 'contain' }} />,
    },
    {
      id: 'phonepe', label: 'PhonePe', color: '#5f259f',
      icon: <img src="https://cdn.simpleicons.org/phonepe/5f259f" alt="PhonePe" width="36" height="36" style={{ objectFit: 'contain' }} />,
    },
    {
      id: 'paytm', label: 'Paytm', color: '#00BAF2',
      icon: <img src="https://cdn.simpleicons.org/paytm/00BAF2" alt="Paytm" width="36" height="36" style={{ objectFit: 'contain' }} />,
    },
    {
      id: 'bhim', label: 'BHIM UPI', color: '#00529C',
      icon: (
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="10" fill="#00529C"/>
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">BHIM</text>
        </svg>
      ),
    },
    {
      id: 'amazonpay', label: 'Amazon Pay', color: '#FF9900',
      icon: <img src="https://cdn.simpleicons.org/amazonpay/FF9900" alt="Amazon Pay" width="36" height="36" style={{ objectFit: 'contain' }} />,
    },
    {
      id: 'airtel', label: 'Airtel Pay', color: '#E40000',
      icon: <img src="https://cdn.simpleicons.org/airtel/E40000" alt="Airtel Pay" width="36" height="36" style={{ objectFit: 'contain' }} />,
    },
    {
      id: 'jiopay', label: 'JioPay', color: '#0066CC',
      icon: (
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="10" fill="#0066CC"/>
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">JIO</text>
        </svg>
      ),
    },
    {
      id: 'sbi', label: 'SBI Pay', color: '#2D6DB5',
      icon: (
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="10" fill="#2D6DB5"/>
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">SBI</text>
        </svg>
      ),
    },
    {
      id: 'icici', label: 'iMobile', color: '#F37021',
      icon: (
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="10" fill="#F37021"/>
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">ICICI</text>
        </svg>
      ),
    },
    {
      id: 'hdfc', label: 'HDFC Bank', color: '#004C8F',
      icon: (
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="10" fill="#004C8F"/>
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">HDFC</text>
        </svg>
      ),
    },
    {
      id: 'axis', label: 'Axis Bank', color: '#97144D',
      icon: (
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="10" fill="#97144D"/>
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">AXIS</text>
        </svg>
      ),
    },
    {
      id: 'indus', label: 'IndusInd', color: '#E31837',
      icon: (
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="10" fill="#E31837"/>
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">INDUS</text>
        </svg>
      ),
    },
  ];

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (payMethod === 'upi') {
      if (!upiApp) { setUpiError('Please select a UPI app.'); return; }
      if (!upiId.match(/^[\w.+-]+@[\w]+$/)) { setUpiError('Enter a valid UPI ID (e.g. name@upi)'); return; }
      setUpiPopup(true);
      return;
    }
    setUpiError('');
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
      <div style={{ paddingTop: '110px', paddingBottom: '80px', maxWidth: '1000px', margin: '0 auto' }} className="px-4 sm:px-6">

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

        <form onSubmit={handlePayment} className="checkout-form-grid">

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

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
                    value={form[f.name as keyof typeof form]}
                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                    onFocus={() => setFocused(f.name)}
                    onBlur={() => setFocused('')}
                    required
                    style={{ width: '100%', padding: '13px 16px 13px 42px', border: `2px solid ${focused === f.name ? '#3b82f6' : '#e5e7eb'}`, borderRadius: '12px', fontSize: '14px', outline: 'none', color: '#1e293b', background: focused === f.name ? 'white' : '#f9fafb', boxSizing: 'border-box', transition: 'all 0.2s ease', boxShadow: focused === f.name ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none' }}
                  />
                </div>
              ))}
            </div>

            {/* Payment Method */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(59,130,246,0.08)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>💳 Payment Method</h2>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {(['stripe', 'upi'] as const).map(m => (
                  <button key={m} type="button" onClick={() => setPayMethod(m)}
                    style={{ flex: 1, padding: '10px', borderRadius: '12px', border: `2px solid ${payMethod === m ? '#3b82f6' : '#e5e7eb'}`, background: payMethod === m ? '#eff6ff' : '#f9fafb', color: payMethod === m ? '#3b82f6' : '#64748b', fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {m === 'stripe' ? '💳 Card / Stripe' : '📲 UPI'}
                  </button>
                ))}
              </div>

              {payMethod === 'stripe' && (
                <p style={{ fontSize: '13px', color: '#64748b', background: '#f8fafc', borderRadius: '10px', padding: '12px 14px' }}>
                  🔒 You'll be redirected to Stripe's secure checkout to complete payment.
                </p>
              )}

              {payMethod === 'upi' && (
                <div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Select UPI App</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                    {UPI_APPS.map(app => (
                      <button key={app.id} type="button" onClick={() => { setUpiApp(app.id); setUpiError(''); }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px 8px', borderRadius: '14px', border: `2px solid ${upiApp === app.id ? app.color : '#e5e7eb'}`, background: upiApp === app.id ? `${app.color}12` : '#f9fafb', cursor: 'pointer', transition: 'all 0.2s', boxShadow: upiApp === app.id ? `0 0 0 3px ${app.color}22` : 'none' }}>
                        {app.icon}
                        <span style={{ fontSize: '10px', fontWeight: 600, color: upiApp === app.id ? app.color : '#64748b' }}>{app.label}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g. name@upi)"
                    value={upiId}
                    onChange={e => { setUpiId(e.target.value); setUpiError(''); }}
                    style={{ width: '100%', padding: '12px 14px', border: `2px solid ${upiError ? '#ef4444' : '#e5e7eb'}`, borderRadius: '12px', fontSize: '14px', outline: 'none', color: '#1e293b', background: '#f9fafb', boxSizing: 'border-box' }}
                  />
                  {upiError && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{upiError}</p>}
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>⚠️ Demo only — no real UPI transaction will occur.</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(59,130,246,0.08)' }} className="checkout-summary-sticky">
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

            <button type="submit" disabled={loading} onClick={payMethod === 'upi' ? (e) => { e.preventDefault(); setUpiPopup(true); } : undefined} style={{ width: '100%', padding: '15px', background: loading ? '#94a3b8' : 'linear-gradient(135deg,#3b82f6,#9333ea)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? (
                <><span style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Redirecting...</>
              ) : payMethod === 'upi' ? `Pay via ${UPI_APPS.find(a => a.id === upiApp)?.label || 'UPI'} · $${total.toFixed(2)}` : `🔒 Pay $${total.toFixed(2)}`}
            </button>
            <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>Secured by Stripe · 256-bit SSL</p>
          </div>
        </form>
      </div>
      <Footer />

      {/* UPI Unavailable Popup */}
      {upiPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '36px 32px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🚧</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>UPI Unavailable</h2>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
              UPI payments are not available right now.<br />Please use <strong>Card / Stripe</strong> to complete your order.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setUpiPopup(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb', background: '#f9fafb', color: '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                onClick={() => { setUpiPopup(false); setPayMethod('stripe'); }}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#3b82f6,#9333ea)', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
              >
                Use Card instead
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .checkout-form-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 28px;
          align-items: start;
        }
        .checkout-summary-sticky {
          position: sticky;
          top: 100px;
        }
        @media (max-width: 768px) {
          .checkout-form-grid {
            grid-template-columns: 1fr;
          }
          .checkout-summary-sticky {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
