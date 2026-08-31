'use client';

import { useState } from 'react';
import { useCookieConsent } from '../context/useCookieConsent';

export default function CookieConsent() {
  const { consent, acceptAll, rejectAll, saveCustom, resetConsent } = useCookieConsent();
  const [showCustom, setShowCustom] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [showManager, setShowManager] = useState(false);

  // Expose resetConsent globally so Footer "Cookies" link can reopen the banner
  if (typeof window !== 'undefined') {
    (window as any).__mmResetCookies = () => { resetConsent(); setShowManager(false); };
  }

  // Banner — shown until user decides
  if (!consent.decided && !showManager) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 pointer-events-none">
        <div className="pointer-events-auto max-w-2xl mx-auto bg-[#13111b] border border-purple-400/25 rounded-2xl shadow-2xl shadow-black/50 p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl flex-shrink-0">🍪</span>
            <div>
              <p className="font-semibold text-white text-sm sm:text-base">We use cookies</p>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1 leading-relaxed">
                We use cookies to remember your cart, preferences, and improve your experience.
                Functional cookies are always on. You choose the rest.
              </p>
            </div>
          </div>

          {showCustom && (
            <div className="mb-4 space-y-3 border-t border-white/8 pt-4">
              {/* Functional — always on */}
              <Toggle
                label="Functional"
                description="Cart, session, and core site features. Always required."
                checked={true}
                disabled
                onChange={() => {}}
              />
              <Toggle
                label="Analytics"
                description="Helps us understand how visitors use the site (no personal data sold)."
                checked={analytics}
                onChange={setAnalytics}
              />
              <Toggle
                label="Marketing"
                description="Personalised offers and relevant ads based on your browsing."
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={() => setShowCustom(v => !v)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-zinc-400 hover:text-purple-300 border border-white/10 rounded-xl transition-colors"
            >
              {showCustom ? 'Hide options' : 'Customise'}
            </button>
            <button
              onClick={rejectAll}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-zinc-300 border border-white/10 rounded-xl hover:border-purple-400/40 transition-colors"
            >
              Reject all
            </button>
            {showCustom ? (
              <button
                onClick={() => saveCustom(analytics, marketing)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white rounded-xl glow-button transition-all hover:-translate-y-0.5"
              >
                Save choices
              </button>
            ) : (
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white rounded-xl glow-button transition-all hover:-translate-y-0.5"
              >
                Accept all
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Consent manager modal — opened via Footer "Cookies" link
  if (showManager || (consent.decided && showManager)) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-md bg-[#13111b] border border-purple-400/25 rounded-2xl shadow-2xl p-6">
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
            <button onClick={rejectAll} className="flex-1 py-2.5 text-sm font-medium text-zinc-300 border border-white/10 rounded-xl hover:border-purple-400/40 transition-colors">
              Reject all
            </button>
            <button onClick={() => saveCustom(analytics, marketing)} className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl glow-button transition-all hover:-translate-y-0.5">
              Save choices
            </button>
            <button onClick={acceptAll} className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl bg-purple-600/30 border border-purple-400/30 hover:bg-purple-600/50 transition-colors">
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
          checked ? 'bg-purple-600' : 'bg-white/15'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
