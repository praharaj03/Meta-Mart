'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { UserButton, SignInButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'

const Navbar = () => {
  const { isSignedIn } = useUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Handle search logic here
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b shadow-lg transition-all duration-300 ${
      isScrolled ? 'bg-white/90 border-gray-200' : 'bg-white/10 border-white/20'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left Navigation */}
        <nav className="flex items-center space-x-7 font-inter">
          <Link href="/" className="font-semibold text-gray-900 hover:text-blue-600 transition-all duration-300 hover:scale-105">
            Home
          </Link>
          <Link href="/shop" className="font-semibold text-gray-900 hover:text-blue-600 transition-all duration-300 hover:scale-105">
            Shop
          </Link>
          <Link href="/faq" className="font-semibold text-gray-900 hover:text-blue-600 transition-all duration-300 hover:scale-105">
            FAQ
          </Link>
          <Link href="/contact" className="font-semibold text-gray-900 hover:text-blue-600 transition-all duration-300 hover:scale-105">
            Contact
          </Link>
          <Link href="/orders" className="font-semibold text-gray-900 hover:text-blue-600 transition-all duration-300 hover:scale-105">
            Orders
          </Link>
        </nav>

        {/* Center Logo */}
        <div className="flex items-center justify-center flex-shrink-0">
          <h1 className="text-3xl font-bold tracking-wide text-gray-900 font-inter">
            Meta<span className="text-blue-600">Mart</span>
          </h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleSearch}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="redirect">
              <button className="flex items-center space-x-1 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105">
                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="text-sm font-semibold text-gray-900 font-inter">Login</span>
              </button>
            </SignInButton>
          )}
          <Link href="/cart" className="relative p-2 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className={`search-overlay ${isSearchOpen ? 'active' : ''}`}>
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              id="search-input"
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-submit">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            <button 
              type="button" 
              onClick={toggleSearch}
              className="search-close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        .search-overlay {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 40;
        }
        
        .search-overlay.active {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }
        
        .search-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        
        .search-form {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 50px;
          padding: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        
        .search-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 16px 24px;
          font-size: 18px;
          background: transparent;
          color: #333;
        }
        
        .search-input::placeholder {
          color: #999;
        }
        
        .search-submit {
          background: linear-gradient(135deg, #3b82f6, #9333ea);
          border: none;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-right: 8px;
        }
        
        .search-submit:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }
        
        .search-close {
          background: #ef4444;
          border: none;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .search-close:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }
      `}</style>
    </header>
  )
}

export default Navbar