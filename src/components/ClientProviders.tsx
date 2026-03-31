'use client';

import { CartProvider } from '../context/CartContext';
import LoadingScreen from '../components/LoadingScreen';
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
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
        {children}
      </CartProvider>
    </ClerkProvider>
  );
}
