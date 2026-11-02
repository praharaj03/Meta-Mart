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
import PushOptIn from './PushOptIn';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const app = (
    <CartProvider>
      <WishlistProvider>
        {children}
        <CookieConsent />
        <LiveChat />
        <PushOptIn />
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
