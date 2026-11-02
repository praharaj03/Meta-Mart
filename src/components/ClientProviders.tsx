'use client';

import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import LoadingScreen from '../components/LoadingScreen';
import CookieConsent from '../components/CookieConsent';
import LiveChat from '../components/LiveChat';
import { ClerkProvider } from '@clerk/nextjs';
import ClerkAuthBridge from './ClerkAuthBridge';
import { AppAuthProvider } from '@/context/AppAuthContext';
import { CLERK_ENABLED } from '@/config/clerk';
import { useEffect } from 'react';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.getRegistrations().then(async registrations => {
      for (const registration of registrations) {
        const workerUrl = registration.active?.scriptURL ?? registration.waiting?.scriptURL ?? registration.installing?.scriptURL;
        if (!workerUrl || new URL(workerUrl).pathname !== '/sw.js') continue;

        try {
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            try {
              const response = await fetch('/api/push/subscribe', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint: subscription.endpoint }),
              });
              if (!response.ok && response.status !== 401) {
                console.error('[push cleanup] Could not remove stored subscription:', response.status);
              }
            } catch (error) {
              console.error('[push cleanup] Could not remove stored subscription:', error);
            }
            await subscription.unsubscribe();
          }
          await registration.unregister();
        } catch (error) {
          console.error('[push cleanup] Could not unregister service worker:', error);
        }
      }
    }).catch(error => console.error('[push cleanup] Could not inspect service workers:', error));
  }, []);

  const app = (
    <CartProvider>
      <WishlistProvider>
        {children}
        <CookieConsent />
        <LiveChat />
      </WishlistProvider>
    </CartProvider>
  );

  if (!CLERK_ENABLED) {
    return <AppAuthProvider value={{ user: null, isLoaded: true, isSignedIn: false }}>{app}</AppAuthProvider>;
  }

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#22c55e',
          colorBackground: '#0b100c',
          colorText: '#f4f8f4',
          colorTextSecondary: '#a1a1aa',
          colorInputBackground: '#151a16',
          colorInputText: '#f4f8f4',
        },
      }}
    >
      <ClerkAuthBridge>{app}</ClerkAuthBridge>
    </ClerkProvider>
  );
}
