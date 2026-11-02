'use client';
import { useEffect, useState } from 'react';
import { useAppAuth } from '@/context/AppAuthContext';

function decodeKey(value: string) {
  const padded = value + '='.repeat((4 - value.length % 4) % 4);
  return Uint8Array.from(atob(padded.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
}

export default function PushOptIn() {
  const { user, isLoaded, isSignedIn } = useAppAuth();
  const [state, setState] = useState<'hidden' | 'ready' | 'enabled'>('hidden');
  const [error, setError] = useState('');
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) {
      setState('hidden');
      return;
    }
    if ('serviceWorker' in navigator && 'PushManager' in window && Notification.permission !== 'denied') {
      navigator.serviceWorker.register('/sw.js').then(registration => registration.pushManager.getSubscription()).then(async subscription => {
        if (subscription) {
          const response = await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription),
          });
          if (!response.ok) throw new Error('Could not link notifications to your account.');
          setState('enabled');
        } else {
          setState('ready');
        }
      }).catch(() => setState('ready'));
    }
  }, [isLoaded, isSignedIn, user?.id]);
  async function enable() {
    setError('');
    try {
      const keyResponse = await fetch('/api/push/subscribe');
      const { publicKey: key } = await keyResponse.json();
      if (!keyResponse.ok) throw new Error('Push notifications are not configured yet.');
      if (!key) throw new Error('Push notifications are not configured yet.');
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') throw new Error('Allow notifications in your browser to continue.');
      const worker = await navigator.serviceWorker.register('/sw.js');
      const subscription = await worker.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeKey(key) });
      const response = await fetch('/api/push/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(subscription) });
      if (!response.ok) throw new Error('Could not save notification settings.');
      setState('enabled');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not enable notifications.'); }
  }
  if (state === 'hidden') return null;
  return <div style={{ position: 'fixed', zIndex: 45, right: 16, bottom: 16, width: 'min(340px,calc(100vw - 32px))', padding: 16, borderRadius: 16, background: '#111a13', border: '1px solid rgba(74,222,128,.3)', boxShadow: '0 15px 45px #0009' }}>
    {state === 'enabled' ? <p style={{ color: '#86efac', fontSize: 13, fontWeight: 700 }}>Order notifications are enabled on this device.</p> : <><p style={{ color: '#f4f8f4', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>Get order updates</p><p style={{ color: '#a1a1aa', fontSize: 12, marginBottom: 12 }}>Allow browser notifications for order and store updates.</p><button onClick={enable} style={{ background: '#16a34a', color: 'white', border: 0, borderRadius: 9, padding: '9px 13px', fontWeight: 700, cursor: 'pointer' }}>Enable notifications</button>{error && <p role="alert" style={{ color: '#fca5a5', fontSize: 11, marginTop: 9 }}>{error}</p>}<button onClick={() => setState('hidden')} aria-label="Dismiss notifications prompt" style={{ float: 'right', border: 0, background: 'none', color: '#a1a1aa', cursor: 'pointer' }}>Dismiss</button></>}
  </div>;
}
