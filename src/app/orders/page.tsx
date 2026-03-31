'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface Order {
  id: string;
  items: { id: number; name: string; price: number; image: string; quantity: number }[];
  total: number;
  address: string;
  name: string;
  date: string;
  status: string;
}

const STEPS = ['Order Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

function getStepIndex(date: string) {
  const hours = (Date.now() - new Date(date).getTime()) / 36e5;
  if (hours < 1) return 0;
  if (hours < 6) return 1;
  if (hours < 24) return 2;
  if (hours < 48) return 3;
  return 4;
}

function getArrival(date: string) {
  const d = new Date(date);
  d.setDate(d.getDate() + 5);
  return d.toDateString();
}

function SpendingChart({ orders }: { orders: Order[] }) {
  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleString('default', { month: 'short' });
    const total = orders
      .filter(o => new Date(o.date).getMonth() === d.getMonth())
      .reduce((s, o) => s + o.total, 0);
    return { month, total };
  });
  const max = Math.max(...last6.map(m => m.total), 1);

  return (
    <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '32px' }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>📊 Monthly Spending</h2>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '140px' }}>
        {last6.map(({ month, total }, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>${total.toFixed(0)}</span>
            <div style={{ width: '100%', height: `${(total / max) * 100}px`, minHeight: '4px', background: 'linear-gradient(180deg,#3b82f6,#9333ea)', borderRadius: '6px 6px 0 0', transition: 'height 0.6s ease' }} />
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    // Save pending order if redirected from Stripe success
    const pending = localStorage.getItem('mm_pending_order');
    if (pending) {
      const existing = JSON.parse(localStorage.getItem('mm_orders') || '[]');
      localStorage.setItem('mm_orders', JSON.stringify([JSON.parse(pending), ...existing]));
      localStorage.removeItem('mm_pending_order');
    }
    setOrders(JSON.parse(localStorage.getItem('mm_orders') || '[]'));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar />
      <div className="pt-28 pb-20 px-6 max-w-4xl mx-auto">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(135deg,#3b82f6,#9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
          My Orders
        </h1>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '24px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📦</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>No orders yet</h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Start shopping to see your orders here</p>
            <Link href="/shop" style={{ background: 'linear-gradient(135deg,#3b82f6,#9333ea)', color: 'white', padding: '14px 32px', borderRadius: '50px', fontWeight: 600, textDecoration: 'none' }}>
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <SpendingChart orders={orders} />

            {orders.map(order => {
              const step = getStepIndex(order.date);
              const isOpen = expanded === order.id;
              return (
                <div key={order.id} style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '20px', border: '1px solid rgba(59,130,246,0.1)' }}>
                  {/* Order Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                    <div>
                      <p style={{ fontSize: '13px', color: '#94a3b8' }}>Order ID</p>
                      <p style={{ fontWeight: 700, color: '#1e293b' }}>{order.id}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', color: '#94a3b8' }}>Placed On</p>
                      <p style={{ fontWeight: 600, color: '#1e293b' }}>{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', color: '#94a3b8' }}>Total</p>
                      <p style={{ fontWeight: 700, color: '#3b82f6', fontSize: '1.1rem' }}>${order.total.toFixed(2)}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '13px', color: '#94a3b8' }}>Expected Delivery</p>
                      <p style={{ fontWeight: 600, color: '#10b981' }}>🚚 {getArrival(order.date)}</p>
                    </div>
                    <button onClick={() => setExpanded(isOpen ? null : order.id)} style={{ background: 'linear-gradient(135deg,#3b82f6,#9333ea)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                      {isOpen ? 'Hide' : 'Details'}
                    </button>
                  </div>

                  {/* Tracking Stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: isOpen ? '24px' : '0' }}>
                    {STEPS.map((s, i) => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: i <= step ? 'linear-gradient(135deg,#3b82f6,#9333ea)' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
                            {i < step ? '✓' : i + 1}
                          </div>
                          <span style={{ fontSize: '10px', color: i <= step ? '#3b82f6' : '#94a3b8', fontWeight: i <= step ? 700 : 400, textAlign: 'center', width: '60px' }}>{s}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div style={{ flex: 1, height: '3px', background: i < step ? 'linear-gradient(90deg,#3b82f6,#9333ea)' : '#e5e7eb', margin: '0 4px', marginBottom: '20px', borderRadius: '2px' }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Expanded Details */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px' }}>
                          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>📍 Delivery Address</p>
                          <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{order.name}</p>
                          <p style={{ color: '#64748b', fontSize: '13px' }}>{order.address}</p>
                        </div>
                        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px' }}>
                          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>🛍️ Items Ordered</p>
                          {order.items.map(item => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                              <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                              <div>
                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{item.name}</p>
                                <p style={{ fontSize: '12px', color: '#64748b' }}>Qty: {item.quantity} · ${item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
