'use client';

import { useState } from 'react';
import { useCookieConsent } from '../context/useCookieConsent';

export default function CookieConsent() {
  const { consent, acceptAll, rejectAll, saveCustom } = useCookieConsent();
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [showManager, setShowManager] = useState(false);

  const openManager = () => {
    setAnalytics(consent.analytics);
    setMarketing(consent.marketing);
    setShowManager(true);
  };

  // Preferences remain available on demand without showing an automatic banner.
  if (typeof window !== 'undefined') {
    (window as any).__mmOpenCookieSettings = openManager;
  }

  if (showManager) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-md bg-[#101610] border border-green-400/25 rounded-2xl shadow-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-white text-lg">Cookie Preferences</h2>
            <button onClick={() => setShowManager(false)} className="text-zinc-400 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="space-y-3 mb-6">
            <Toggle label="Functional" description="Cart, session, and core site features. Always required." checked={true} disabled onChange={() => {}} />
            <Toggle label="Analytics" description="Helps us understand how visitors use the site." checked={analytics} onChange={setAnalytics} />
            <Toggle label="Marketing" description="Personalised offers and relevant ads." checked={marketing} onChange={setMarketing} />
          </div>
          <div className="flex gap-2">
            <button onClick={rejectAll} className="flex-1 py-2.5 text-sm font-medium text-zinc-300 border border-white/10 rounded-xl hover:border-green-400/40 transition-colors">
              Reject all
            </button>
            <button onClick={() => saveCustom(analytics, marketing)} className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl glow-button transition-all hover:-translate-y-0.5">
              Save choices
            </button>
            <button onClick={acceptAll} className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl bg-green-600/30 border border-green-400/30 hover:bg-green-600/50 transition-colors">
              Accept all
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function Toggle({ label, description, checked, disabled, onChange }: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-white/4 border border-white/8">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative flex-shrink-0 w-10 h-6 rounded-full transition-colors duration-200 mt-0.5 ${
          checked ? 'bg-green-600' : 'bg-white/15'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
