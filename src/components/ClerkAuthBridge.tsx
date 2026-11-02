'use client';

import { useUser } from '@clerk/nextjs';
import { AppAuthProvider } from '@/context/AppAuthContext';

export default function ClerkAuthBridge({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();

  return (
    <AppAuthProvider
      value={{
        user: user
          ? {
              id: user.id,
              fullName: user.fullName,
              primaryEmailAddress: user.primaryEmailAddress
                ? { emailAddress: user.primaryEmailAddress.emailAddress }
                : null,
            }
          : null,
        isLoaded,
        isSignedIn: Boolean(isSignedIn),
      }}
    >
      {children}
    </AppAuthProvider>
  );
}
