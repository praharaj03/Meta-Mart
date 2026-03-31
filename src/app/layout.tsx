'use client';

import "./globals.css";
import { CartProvider } from '../context/CartContext';
import LoadingScreen from '../components/LoadingScreen';
import { useState, useEffect } from 'react';
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  return (
    <ClerkProvider>
    <html lang="en" className="scroll-smooth">
      <body>
        <CartProvider>
          {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
          {children}
        </CartProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
