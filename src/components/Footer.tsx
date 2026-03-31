"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
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
              {[
                { name: "Facebook", img: "/fb.png", href: "https://linkedin.com/in/praharajabhisek" },
                { name: "X", img: "/x.png", href: "https://x.com/praharaj25" },
                { name: "Instagram", img: "/insta.png", href: "https://instagram.com/blank_canvas03" },
                { name: "Mail", img: "/mail.png", href: "mailto:support@metamart.com" },
              ].map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target={social.name !== "Mail" ? "_blank" : "_self"}
                  rel={social.name !== "Mail" ? "noopener noreferrer" : ""}
                  className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-xl hover:bg-blue-500 hover:scale-110 transition-all duration-300 hover:rotate-12"
                >
                  <Image
                    src={social.img}
                    alt={social.name}
                    width={24}
                    height={24}
                  />
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-400 focus:outline-none transition-colors duration-300"
              />
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
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
    </footer>
  );
};

export default Footer;
