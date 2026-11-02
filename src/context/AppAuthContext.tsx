'use client';

import { createContext, useContext } from 'react';

export interface AppUser {
  id: string;
  fullName: string | null;
  primaryEmailAddress: { emailAddress: string } | null;
}

interface AppAuthState {
  user: AppUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
}

const AppAuthContext = createContext<AppAuthState>({
  user: null,
  isLoaded: true,
  isSignedIn: false,
});

export const AppAuthProvider = AppAuthContext.Provider;

export function useAppAuth() {
  return useContext(AppAuthContext);
}
