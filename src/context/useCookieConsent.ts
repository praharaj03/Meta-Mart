'use client';

import { useState, useEffect, useCallback } from 'react';

export type ConsentState = {
  decided: boolean;
  functional: boolean; // always true once accepted
  analytics: boolean;
  marketing: boolean;
};

const COOKIE_NAME = 'mm_cookie_consent';
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function parseCookie(): ConsentState | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

function writeCookie(state: ConsentState) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(state))}; max-age=${MAX_AGE}; path=/; SameSite=Lax`;
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentState>({
    decided: false,
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = parseCookie();
    if (saved) setConsent(saved);
  }, []);

  const acceptAll = useCallback(() => {
    const state: ConsentState = { decided: true, functional: true, analytics: true, marketing: true };
    writeCookie(state);
    setConsent(state);
  }, []);

  const rejectAll = useCallback(() => {
    const state: ConsentState = { decided: true, functional: true, analytics: false, marketing: false };
    writeCookie(state);
    setConsent(state);
  }, []);

  const saveCustom = useCallback((analytics: boolean, marketing: boolean) => {
    const state: ConsentState = { decided: true, functional: true, analytics, marketing };
    writeCookie(state);
    setConsent(state);
  }, []);

  const resetConsent = useCallback(() => {
    document.cookie = `${COOKIE_NAME}=; max-age=0; path=/`;
    setConsent({ decided: false, functional: false, analytics: false, marketing: false });
  }, []);

  return { consent, acceptAll, rejectAll, saveCustom, resetConsent };
}
