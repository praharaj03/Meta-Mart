"use client";

import React, { useState } from "react";
import Link from "next/link";

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
    <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-indigo-400 rounded-full animate-ping"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-blue-400 mb-4">MetaMart</h3>
            <p className="text-gray-300 leading-relaxed">
              Your trusted partner for premium quality products. Shop with
              confidence and experience excellence.
            </p>
            <div className="flex space-x-4 pt-4">
              {/* Social Media Links */}
              {
                [
                  {
                    name: "X",
                    href: "https://x.com/praharaj25",
                    hoverBg: "#000000",
                    shadow: "rgba(0,0,0,0.5)",
                    svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.25 2.25h6.988l4.27 5.647 4.736-5.647zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                  },
                  {
                    name: "Instagram",
                    href: "https://instagram.com/blank_canvas03",
                    hoverBg: "#d6249f",
                    shadow: "rgba(214,36,159,0.5)",
                    svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
                  },
                  {
                    name: "LinkedIn",
                    href: "https://linkedin.com/in/praharajabhisek",
                    hoverBg: "#0A66C2",
                    shadow: "rgba(10,102,194,0.5)",
                    svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
                  },
                  {
                    name: "Mail",
                    href: "mailto:devopspraharaj25@gmail.com",
                    hoverBg: "#EA4335",
                    shadow: "rgba(234,67,53,0.5)",
                    svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
                  },
                ].map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target={social.name !== "Mail" ? "_blank" : "_self"}
                    rel={social.name !== "Mail" ? "noopener noreferrer" : ""}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300"
                    style={{ background: "rgba(59,130,246,0.2)" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = social.hoverBg;
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 20px ${social.shadow}`;
                      (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.1) translateY(-2px)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "rgba(59,130,246,0.2)";
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLAnchorElement).style.transform = "none";
                    }}
                  >
                    {social.svg}
                  </Link>
                ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-blue-400">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Home", "Shop", "About Us", "Contact", "FAQ"].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 hover:translate-x-2 inline-block"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-blue-400">
              Customer Service
            </h4>
            <ul className="space-y-3">
              {[
                "Support Center",
                "Returns",
                "Shipping Info",
                "Size Guide",
                "Track Order",
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 hover:translate-x-2 inline-block"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-blue-400">
              Stay Connected
            </h4>
            <p className="text-gray-300 mb-4">
              Subscribe to get updates on new products and offers!
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={subEmail}
                onChange={e => setSubEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-400 focus:outline-none transition-colors duration-300"
              />
              <button onClick={handleSubscribe} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-center md:text-left">
              <p>&copy; 2024 MetaMart. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (policy) => (
                  <Link
                    key={policy}
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm"
                  >
                    {policy}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full flex items-center justify-center text-white text-xl shadow-lg hover:scale-110 transition-all duration-300 animate-bounce hover:animate-none"
          >
            ↑
          </button>
        </div>
      </div>
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium animate-bounce">
          📬 We&apos;ll send you the latest updates!
        </div>
      )}
    </footer>
  );
};

export default Footer;
