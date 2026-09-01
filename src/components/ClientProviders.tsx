'use client';

import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import LoadingScreen from '../components/LoadingScreen';
import CookieConsent from '../components/CookieConsent';
import LiveChat from '../components/LiveChat';
import { ClerkProvider } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  return (
    <ClerkProvider>
      <CartProvider>
        <WishlistProvider>
          {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
          {children}
          <CookieConsent />
          <LiveChat />
        </WishlistProvider>
      </CartProvider>
    </ClerkProvider>
  );
}
