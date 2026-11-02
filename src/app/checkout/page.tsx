'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';
import { useAppAuth } from '@/context/AppAuthContext';
import { SHIPPING_FREE_THRESHOLD, STANDARD_SHIPPING } from '@/lib/currency';
import { APPLIED_COUPON_STORAGE_KEY } from '@/lib/coupon-constants';

const fields = [
  { name: 'name', placeholder: 'Full Name', type: 'text', icon: '👤' },
  { name: 'email', placeholder: 'Email Address', type: 'email', icon: '📧' },
  { name: 'phone', placeholder: 'Phone Number', type: 'tel', icon: '📱' },
  { name: 'address', placeholder: 'Street Address', type: 'text', icon: '🏠' },
  { name: 'city', placeholder: 'City', type: 'text', icon: '🏙️' },
  { name: 'pincode', placeholder: 'PIN / ZIP Code', type: 'text', icon: '📮' },
];

const EMPTY_FORM = { name: '', email: '', phone: '', address: '', city: '', pincode: '' };
const CHECKOUT_DRAFT_KEY = 'metamart_checkout_draft';

function loadCheckoutDraft() {
  if (typeof window === 'undefined') return { form: EMPTY_FORM, payMethod: 'stripe' as const, upiApp: '', upiId: '' };
  try {
    const draft = JSON.parse(window.localStorage.getItem(CHECKOUT_DRAFT_KEY) ?? '{}');
    return { form: { ...EMPTY_FORM, ...draft.form }, payMethod: draft.payMethod === 'upi' ? 'upi' as const : 'stripe' as const, upiApp: draft.upiApp ?? '', upiId: draft.upiId ?? '' };
  } catch { return { form: EMPTY_FORM, payMethod: 'stripe' as const, upiApp: '', upiId: '' }; }
}

export default function CheckoutPage() {
  const { items, hydrated } = useCart();
  const router = useRouter();
  const [draft] = useState(loadCheckoutDraft);
  const [form, setForm] = useState(draft.form);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [payMethod, setPayMethod] = useState<'stripe' | 'upi'>(draft.payMethod);
  const [upiApp, setUpiApp] = useState(draft.upiApp);
  const [upiId, setUpiId] = useState(draft.upiId);
  const [upiError, setUpiError] = useState('');
  const [upiPopup, setUpiPopup] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponReady, setCouponReady] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedPopup, setBlockedPopup] = useState(false);

  const UPI_APPS = [
    { id: 'gpay', label: 'Google Pay', color: '#4285F4', icon: <img src="https://cdn.simpleicons.org/googlepay/4285F4" alt="Google Pay" width="36" height="36" style={{ objectFit: 'contain' }} /> },
    { id: 'phonepe', label: 'PhonePe', color: '#5f259f', icon: <img src="https://cdn.simpleicons.org/phonepe/5f259f" alt="PhonePe" width="36" height="36" style={{ objectFit: 'contain' }} /> },
    { id: 'paytm', label: 'Paytm', color: '#00BAF2', icon: <img src="https://cdn.simpleicons.org/paytm/00BAF2" alt="Paytm" width="36" height="36" style={{ objectFit: 'contain' }} /> },
    { id: 'bhim', label: 'BHIM UPI', color: '#00529C', icon: (<svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="#00529C"/><text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">BHIM</text></svg>) },
    { id: 'amazonpay', label: 'Amazon Pay', color: '#FF9900', icon: <img src="https://cdn.simpleicons.org/amazonpay/FF9900" alt="Amazon Pay" width="36" height="36" style={{ objectFit: 'contain' }} /> },
    { id: 'airtel', label: 'Airtel Pay', color: '#E40000', icon: <img src="https://cdn.simpleicons.org/airtel/E40000" alt="Airtel Pay" width="36" height="36" style={{ objectFit: 'contain' }} /> },
    { id: 'jiopay', label: 'JioPay', color: '#0066CC', icon: (<svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="#0066CC"/><text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">JIO</text></svg>) },
    { id: 'sbi', label: 'SBI Pay', color: '#2D6DB5', icon: (<svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="#2D6DB5"/><text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">SBI</text></svg>) },
    { id: 'icici', label: 'iMobile', color: '#F37021', icon: (<svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="#F37021"/><text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">ICICI</text></svg>) },
    { id: 'hdfc', label: 'HDFC Bank', color: '#004C8F', icon: (<svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="#004C8F"/><text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">HDFC</text></svg>) },
    { id: 'axis', label: 'Axis Bank', color: '#97144D', icon: (<svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="#97144D"/><text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">AXIS</text></svg>) },
    { id: 'indus', label: 'IndusInd', color: '#E31837', icon: (<svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="#E31837"/><text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">INDUS</text></svg>) },
  ];

  const { user } = useAppAuth();

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify({ form, payMethod, upiApp, upiId }));
  }, [form, payMethod, upiApp, upiId, hydrated]);

  useEffect(() => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;
    fetch('/api/blocked-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then(r => r.json()).then(d => {
      if (d.blocked) { setIsBlocked(true); setBlockedPopup(true); }
    });
  }, [user]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const tax = subtotal * 0.08;
  const total = Math.max(0, subtotal + shipping + tax - couponDiscount);

  useEffect(() => {
    if (!hydrated) return;
    let active = true;
    const savedCode = localStorage.getItem(APPLIED_COUPON_STORAGE_KEY);
    if (!savedCode) {
      setCouponReady(true);
      return;
    }

    const refreshCoupon = async () => {
      setCouponLoading(true);
      try {
        const response = await fetch('/api/coupons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: savedCode, orderTotal: subtotal + shipping + tax }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to validate coupon');
        if (!active) return;
        setCouponApplied(data.code);
        setCouponDiscount(data.discount);
        setCouponError('');
      } catch (error) {
        if (!active) return;
        localStorage.removeItem(APPLIED_COUPON_STORAGE_KEY);
        setCouponApplied('');
        setCouponDiscount(0);
        setCouponError(error instanceof Error ? error.message : 'Unable to validate coupon');
      } finally {
        if (active) {
          setCouponLoading(false);
          setCouponReady(true);
        }
      }
    };

    void refreshCoupon();
    return () => { active = false; };
  }, [hydrated, subtotal, shipping, tax]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (isBlocked) { setBlockedPopup(true); return; }
    if (payMethod === 'upi') {
      if (!upiApp) { setUpiError('Please select a UPI app.'); return; }
      if (!upiId.match(/^[\w.+-]+@[\w]+$/)) { setUpiError('Enter a valid UPI ID (e.g. name@upi)'); return; }
    }
    setUpiError('');
    setLoading(true);
    setCheckoutError('');
    try {
      sessionStorage.setItem('metamart_payment_pending', JSON.stringify({ startedAt: Date.now(), cart: items }));
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          address: form,
          userEmail: user?.primaryEmailAddress?.emailAddress || form.email,
          userName: user?.fullName || form.name,
          couponCode: couponApplied,
        }),
      });
      const data = await res.json();
      if (res.status === 403) { setIsBlocked(true); setBlockedPopup(true); setLoading(false); return; }
      if (!res.ok) throw new Error(data.error || 'Unable to start checkout');
      if (!data.url) throw new Error('Unable to start checkout');
      window.location.href = data.url;
    } catch (error) {
      sessionStorage.removeItem('metamart_payment_pending');
      setLoading(false);
      setCheckoutError(error instanceof Error ? error.message : 'Unable to start checkout');
    }
  };

  if (!hydrated) return <div className="min-h-screen grid place-items-center"><div className="text-sm font-semibold text-purple-300">Restoring your checkout…</div></div>;

  if (items.length === 0) return (
    <div style={{ minHeight: '100vh', background: '#08070d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f4f8f4', marginBottom: '8px' }}>Your cart is empty</h2>
        <p style={{ color: '#a1a1aa', marginBottom: '24px' }}>Add items before checking out</p>
        <Link href="/shop" style={{ background: 'linear-gradient(135deg,#86efac,#16a34a)', color: 'white', padding: '14px 32px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none' }}>Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#08070d 0%,#0d0b13 50%,#08070d 100%)' }}>
      <Navbar />
      <div style={{ paddingTop: '110px', paddingBottom: '80px', maxWidth: '1000px', margin: '0 auto' }} className="px-4 sm:px-6">

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '14px', color: '#a1a1aa' }}>
          <Link href="/cart" style={{ color: '#86efac', textDecoration: 'none', fontWeight: 600 }}>Cart</Link>
          <span>›</span>
          <span style={{ color: '#f4f8f4', fontWeight: 600 }}>Checkout</span>
          <span>›</span>
          <span>Payment</span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg,#22c55e,#15803d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '28px' }}>
          Checkout
        </h1>

        <form onSubmit={handlePayment} className="checkout-form-grid">

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div style={{ background: '#101610', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', border: '1px solid rgba(74,222,128,.15)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4f8f4', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>📦 Delivery Address</h2>
              {fields.map(f => (
                <div key={f.name} style={{ position: 'relative', marginBottom: '14px' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none' }}>{f.icon}</span>
                  <input
                    name={f.name} type={f.type} placeholder={f.placeholder}
                    value={form[f.name as keyof typeof form]}
                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                    onFocus={() => setFocused(f.name)} onBlur={() => setFocused('')} required
                    style={{ width: '100%', padding: '13px 16px 13px 42px', border: `2px solid ${focused === f.name ? '#86efac' : 'rgba(74,222,128,.2)'}`, borderRadius: '12px', fontSize: '14px', outline: 'none', color: '#f4f8f4', background: focused === f.name ? '#171e18' : '#151a16', boxSizing: 'border-box', transition: 'all 0.2s ease', boxShadow: focused === f.name ? '0 0 0 3px rgba(34,197,94,.18)' : 'none' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ background: '#101610', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', border: '1px solid rgba(74,222,128,.15)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4f8f4', marginBottom: '16px' }}>💳 Payment Method</h2>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {(['stripe', 'upi'] as const).map(m => (
                  <button key={m} type="button" onClick={() => setPayMethod(m)}
                    style={{ flex: 1, padding: '10px', borderRadius: '12px', border: `2px solid ${payMethod === m ? '#86efac' : 'rgba(74,222,128,.2)'}`, background: payMethod === m ? 'rgba(74,222,128,.1)' : '#151a16', color: payMethod === m ? '#86efac' : '#a1a1aa', fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {m === 'stripe' ? '💳 Card / Stripe' : '📲 UPI'}
                  </button>
                ))}
              </div>
              {payMethod === 'stripe' && (
                <p style={{ fontSize: '13px', color: '#a1a1aa', background: '#151a16', borderRadius: '10px', padding: '12px 14px' }}>
                  🔒 You'll be redirected to Stripe's secure checkout to complete payment.
                </p>
              )}
              {payMethod === 'upi' && (
                <div>
                  <p style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Select UPI App</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                    {UPI_APPS.map(app => (
                      <button key={app.id} type="button" onClick={() => { setUpiApp(app.id); setUpiError(''); }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px 8px', borderRadius: '14px', border: `2px solid ${upiApp === app.id ? app.color : '#e5e7eb'}`, background: upiApp === app.id ? `${app.color}12` : '#f9fafb', cursor: 'pointer', transition: 'all 0.2s', boxShadow: upiApp === app.id ? `0 0 0 3px ${app.color}22` : 'none' }}>
                        {app.icon}
                        <span style={{ fontSize: '10px', fontWeight: 600, color: upiApp === app.id ? app.color : '#a1a1aa' }}>{app.label}</span>
                      </button>
                    ))}
                  </div>
                  <input type="text" placeholder="Enter UPI ID (e.g. name@upi)" value={upiId}
                    onChange={e => { setUpiId(e.target.value); setUpiError(''); }}
                    style={{ width: '100%', padding: '12px 14px', border: `2px solid ${upiError ? '#ef4444' : 'rgba(74,222,128,.2)'}`, borderRadius: '12px', fontSize: '14px', outline: 'none', color: '#f4f8f4', background: '#151a16', boxSizing: 'border-box' }}
                  />
                  {upiError && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{upiError}</p>}
                  <p style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '8px' }}>⚠️ Demo only — no real UPI transaction will occur.</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: '#101610', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', border: '1px solid rgba(74,222,128,.15)' }} className="checkout-summary-sticky">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4f8f4', marginBottom: '20px' }}>🧾 Order Summary</h2>
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#f4f8f4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                    <p style={{ fontSize: '12px', color: '#a1a1aa' }}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#f4f8f4', flexShrink: 0 }}>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr style={{ borderColor: 'rgba(74,222,128,.15)', margin: '16px 0' }} />
            {[['Subtotal', `Rs. ${subtotal.toFixed(2)}`], ['Shipping', shipping === 0 ? '🎉 Free' : `Rs. ${shipping.toFixed(2)}`], ['Tax (8%)', `Rs. ${tax.toFixed(2)}`]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                <span style={{ color: '#a1a1aa' }}>{k}</span>
                <span style={{ fontWeight: 600, color: '#f4f8f4' }}>{v}</span>
              </div>
            ))}
            <hr style={{ borderColor: 'rgba(74,222,128,.15)', margin: '16px 0' }} />

            {couponApplied ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '13px', color: '#34d399', fontWeight: 700 }}>🎟️ {couponApplied}</span>
                  <p style={{ fontSize: '11px', color: '#6ee7b7', marginTop: '2px' }}>Applied in your cart</p>
                </div>
                <span style={{ fontSize: '14px', color: '#34d399', fontWeight: 800 }}>−Rs. {couponDiscount.toFixed(2)}</span>
              </div>
            ) : couponError ? (
              <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>{couponError} <Link href="/cart" style={{ color: '#86efac' }}>Return to cart</Link></p>
            ) : (
              <p style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '12px' }}>
                Coupons can be applied in your <Link href="/cart" style={{ color: '#86efac' }}>cart</Link>.
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#86efac', marginBottom: '20px' }}>
              <span>Total</span>
              <div style={{ textAlign: 'right' }}>
                {couponDiscount > 0 && <p style={{ fontSize: '11px', color: '#34d399', fontWeight: 600, marginBottom: '2px' }}>You save Rs. {couponDiscount.toFixed(2)}!</p>}
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            {checkoutError && <p role="alert" style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>{checkoutError}</p>}

            <button
              type="submit"
              disabled={loading || isBlocked || couponLoading || !couponReady}
              onClick={isBlocked ? (e) => { e.preventDefault(); setBlockedPopup(true); } : undefined}
              style={{ width: '100%', padding: '15px', background: isBlocked ? 'rgba(239,68,68,0.15)' : loading ? '#a1a1aa' : 'linear-gradient(135deg,#22c55e,#15803d)', color: isBlocked ? '#f87171' : 'white', border: isBlocked ? '1px solid rgba(239,68,68,0.3)' : 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 700, cursor: isBlocked || loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {isBlocked ? '🚫 Account Restricted' : loading ? (
                <><span style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Processing...</>
              ) : payMethod === 'upi' ? `Pay via ${UPI_APPS.find(a => a.id === upiApp)?.label || 'UPI'} · Rs. ${total.toFixed(2)}` : `🔒 Pay Rs. ${total.toFixed(2)}`}
            </button>
            <p style={{ textAlign: 'center', fontSize: '11px', color: '#a1a1aa', marginTop: '10px' }}>Secured by Stripe · 256-bit SSL</p>
          </div>
        </form>
      </div>
      <Footer />

      {/* Blocked User Popup */}
      {blockedPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#101610', borderRadius: '24px', padding: '40px 32px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px' }}>🚫</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f87171', marginBottom: '12px' }}>Account Restricted</h2>
            <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.7, marginBottom: '8px' }}>
              Your account has been restricted from making purchases on MetaMart.
            </p>
            <p style={{ fontSize: '13px', color: '#71717a', lineHeight: 1.6, marginBottom: '28px' }}>
              You can still browse and add items to your cart, but checkout is unavailable. Please contact our support team for assistance.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setBlockedPopup(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#a1a1aa', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                Close
              </button>
              <Link href="/contact"
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* UPI Unavailable Popup */}
      {upiPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#101610', borderRadius: '24px', padding: '36px 32px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(74,222,128,.2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🚧</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f4f8f4', marginBottom: '10px' }}>UPI Unavailable</h2>
            <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '24px' }}>
              UPI payments are not available right now.<br />Please use <strong style={{ color: '#f4f8f4' }}>Card / Stripe</strong> to complete your order.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setUpiPopup(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid rgba(74,222,128,.2)', background: '#151a16', color: '#a1a1aa', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                Close
              </button>
              <button onClick={() => { setUpiPopup(false); setPayMethod('stripe'); }}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#22c55e,#15803d)', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                Use Card instead
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .checkout-form-grid { display: grid; grid-template-columns: 1fr 360px; gap: 28px; align-items: start; }
        .checkout-summary-sticky { position: sticky; top: 100px; }
        @media (max-width: 768px) {
          .checkout-form-grid { grid-template-columns: 1fr; }
          .checkout-summary-sticky { position: static; }
        }
      `}</style>
    </div>
  );
}
