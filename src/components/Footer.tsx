"use client";

import React, { useState } from "react";
import Link from "next/link";

const socials = [
  {
    name: "X", href: "https://x.com/praharaj25", hoverBg: "#000", shadow: "rgba(0,0,0,0.5)",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.25 2.25h6.988l4.27 5.647 4.736-5.647zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    name: "Instagram", href: "https://instagram.com/blank_canvas03", hoverBg: "#d6249f", shadow: "rgba(214,36,159,0.5)",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
  },
  {
    name: "LinkedIn", href: "https://linkedin.com/in/praharajabhisek", hoverBg: "#0A66C2", shadow: "rgba(10,102,194,0.5)",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    name: "Mail", href: "mailto:devopspraharaj25@gmail.com", hoverBg: "#EA4335", shadow: "rgba(234,67,53,0.5)",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
  },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Orders", href: "/orders" },
];

const Footer = () => {
  const [subEmail, setSubEmail] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubscribe = () => {
    if (!subEmail) return;
    setShowToast(true);
    setSubEmail("");
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <footer className="border-t border-purple-400/20 bg-[#0d0914] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Top grid: brand+socials | links | newsletter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="space-y-4">
            <h3 className="display-font text-2xl font-bold text-white">
              Meta<span className="text-purple-400">Mart</span>
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              A considered collection of technology, style, and home essentials.
            </p>
            <div className="flex gap-3 pt-1">
              {socials.map(s => (
                <Link
                  key={s.name}
                  href={s.href}
                  target={s.name !== "Mail" ? "_blank" : "_self"}
                  rel={s.name !== "Mail" ? "noopener noreferrer" : ""}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-300"
                  style={{ background: "rgba(168,85,247,0.15)" }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = s.hoverBg;
                    el.style.boxShadow = `0 6px 16px ${s.shadow}`;
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(168,85,247,0.15)";
                    el.style.boxShadow = "none";
                    el.style.transform = "none";
                  }}
                >
                  {s.svg}
                </Link>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-widest mb-4">Navigate</h4>
            <ul className="space-y-2">
              {navLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-zinc-400 hover:text-purple-300 transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-widest mb-4">Support</h4>
            <ul className="space-y-2">
              {[
                { label: 'Help & FAQ',        href: '/faq' },
                { label: 'Contact Us',        href: '/contact' },
                { label: 'Track Your Order',  href: '/orders' },
                { label: 'Returns & Refunds', href: '/faq#returns' },
                { label: 'Shipping Info',     href: '/faq#shipping' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-zinc-400 hover:text-purple-300 transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-widest mb-4">Stay in the loop</h4>
            <p className="text-sm text-zinc-400 mb-3">New drops and offers, straight to your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={subEmail}
                onChange={e => setSubEmail(e.target.value)}
                className="flex-1 min-w-0 px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:border-purple-400 focus:outline-none text-white placeholder-zinc-500 transition-colors"
              />
              <button
                onClick={handleSubscribe}
                className="px-4 py-2 text-sm font-semibold rounded-lg glow-button text-white whitespace-nowrap transition-all hover:-translate-y-0.5"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} MetaMart. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-purple-300 transition-colors duration-200">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-purple-300 transition-colors duration-200">Terms</Link>
            <button
              onClick={() => (window as any).__mmResetCookies?.()}
              className="hover:text-purple-300 transition-colors duration-200 cursor-pointer"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>

      {/* Scroll-to-top */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-10 h-10 rounded-full glow-button flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300"
          aria-label="Back to top"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6"/></svg>
        </button>
      </div>

      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-medium">
          📬 You&apos;re on the list!
        </div>
      )}
    </footer>
  );
};

export default Footer;
