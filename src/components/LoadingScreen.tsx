'use client';

import { useEffect } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 550);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return <div className="loading-screen" role="status" aria-label="Loading MetaMart">
    <div className="loading-mark" aria-hidden="true"><i /><i /><i /></div>
    <div className="loading-brand">Meta<span>Mart</span></div>
    <p>Preparing your edit</p>
    <style jsx>{`
      .loading-screen { position:fixed; inset:0; z-index:9999; display:grid; place-content:center; justify-items:center; gap:13px; background:#08070d; color:#fff; animation:exit .22s ease .4s forwards; }
      .loading-screen::before { content:""; position:absolute; width:22rem; height:22rem; border-radius:50%; background:#7c3aed; opacity:.17; filter:blur(90px); }
      .loading-brand { position:relative; font-family:"Space Grotesk",Arial,sans-serif; font-size:2rem; font-weight:700; letter-spacing:-.08em; }
      .loading-brand span { color:#c084fc; }
      .loading-screen p { position:relative; margin:0; color:#c6bdd2; font-size:.72rem; font-weight:700; letter-spacing:.13em; text-transform:uppercase; }
      .loading-mark { position:relative; display:flex; align-items:center; gap:5px; height:18px; }
      .loading-mark i { display:block; width:5px; height:5px; border-radius:999px; background:#c084fc; animation:rise .65s ease-in-out infinite; }
      .loading-mark i:nth-child(2) { animation-delay:.1s; background:#a855f7; }
      .loading-mark i:nth-child(3) { animation-delay:.2s; background:#7c3aed; }
      @keyframes rise { 0%,100% { transform:translateY(0); opacity:.35; } 50% { transform:translateY(-7px); opacity:1; } }
      @keyframes exit { to { opacity:0; visibility:hidden; } }
      @media (prefers-reduced-motion:reduce) { .loading-screen, .loading-mark i { animation:none; } }
    `}</style>
  </div>;
}
