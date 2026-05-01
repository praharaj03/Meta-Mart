'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { downloadReceipt } from '@/utils/generateReceipt';
import Link from 'next/link';

export default function ReceiptPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [status, setStatus] = useState<'loading' | 'done' | 'notfound'>('loading');

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('mm_orders') ?? '[]');
    const order = orders.find((o: { id: string }) => o.id === orderId);
    if (!order) { setStatus('notfound'); return; }
    downloadReceipt(order);
    setStatus('done');
  }, [orderId]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0f4ff,#faf5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '48px 40px', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.10)', maxWidth: '400px', width: '100%' }}>
        {status === 'loading' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
            <h2 style={{ color: '#1e293b', fontWeight: 800, marginBottom: '8px' }}>Preparing Receipt...</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Your PDF will download shortly.</p>
          </>
        )}
        {status === 'done' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
            <h2 style={{ color: '#1e293b', fontWeight: 800, marginBottom: '8px' }}>Receipt Downloaded!</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Check your downloads folder for <strong>MetaMart-Receipt-{orderId}.pdf</strong></p>
            <Link href="/orders" style={{ background: 'linear-gradient(135deg,#3b82f6,#9333ea)', color: 'white', padding: '12px 28px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
              View My Orders
            </Link>
          </>
        )}
        {status === 'notfound' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>❌</div>
            <h2 style={{ color: '#1e293b', fontWeight: 800, marginBottom: '8px' }}>Order Not Found</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>This receipt link only works on the device where the order was placed.</p>
            <Link href="/orders" style={{ background: 'linear-gradient(135deg,#3b82f6,#9333ea)', color: 'white', padding: '12px 28px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
              View My Orders
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
