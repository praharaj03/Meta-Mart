'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';

export default function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { addToCart } = useCart();
  const [toast, setToast] = useState('');

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({ id: item.id as any, name: item.name, price: item.price, image: item.image });
    setToast(`${item.name} added to cart!`);
    setTimeout(() => setToast(''), 3000);
  };

  const discount = (price: number, original: number) => Math.round((1 - price / original) * 100);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#08070d 0%,#0d0b13 50%,#08070d 100%)' }}>
      <Navbar />

      <div style={{ paddingTop: '110px', paddingBottom: '80px', maxWidth: '1100px', margin: '0 auto' }} className="px-4 sm:px-6 wishlist-wrap">
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <FiHeart style={{ color: '#f43f5e', width: '28px', height: '28px', fill: '#f43f5e' }} />
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, background: 'linear-gradient(135deg,#f43f5e,#9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px' }}>My Wishlist</h1>
            <p style={{ color: '#b7aec8', fontSize: '15px' }}>{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#13111b', borderRadius: '24px', border: '1px solid rgba(244,63,94,0.15)' }}>
            <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🤍</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f7f4ff', marginBottom: '8px' }}>Your wishlist is empty</h2>
            <p style={{ color: '#b7aec8', marginBottom: '28px' }}>Save items you love while browsing the shop</p>
            <Link href="/shop" style={{ background: 'linear-gradient(135deg,#f43f5e,#9333ea)', color: 'white', padding: '14px 36px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}>
              Browse Shop
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '16px' }}>
            {items.map((item, idx) => (
              <div key={item.id} style={{ background: '#13111b', borderRadius: '20px', border: '1px solid rgba(244,63,94,0.15)', overflow: 'hidden', animation: `fadeUp 0.4s ease-out ${idx * 60}ms both`, transition: 'border-color 0.2s', position: 'relative' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(244,63,94,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(244,63,94,0.15)')}>

                {/* Remove button */}
                <button onClick={() => toggle(item)}
                  style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                  title="Remove from wishlist">
                  <FiTrash2 style={{ color: '#f87171', width: '15px', height: '15px' }} />
                </button>

                {/* Badge */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
                  <span style={{ padding: '3px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 700, background: item.badge === 'Best Seller' ? '#ef4444' : item.badge === 'New' ? '#10b981' : item.badge === 'Pro' ? '#9333ea' : '#3b82f6', color: 'white' }}>
                    {item.badge}
                  </span>
                </div>

                <img src={item.image} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />

                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: '11px', color: '#9333ea', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{item.category}</p>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f7f4ff', marginBottom: '10px', lineHeight: 1.3 }}>{item.name}</h3>

                  {/* Stars */}
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < Math.floor(item.rating) ? '#facc15' : '#374151', fontSize: '13px' }}>★</span>
                    ))}
                    <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '4px' }}>{item.rating}</span>
                  </div>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f7f4ff' }}>Rs. {item.price}</span>
                    <span style={{ fontSize: '13px', color: '#64748b', textDecoration: 'line-through' }}>Rs. {item.originalPrice}</span>
                    <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>{discount(item.price, item.originalPrice)}% OFF</span>
                  </div>

                  <button onClick={() => handleAddToCart(item)}
                    style={{ width: '100%', padding: '11px', borderRadius: '12px', background: 'linear-gradient(135deg,#3b82f6,#9333ea)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <FiShoppingCart style={{ width: '16px', height: '16px' }} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {toast && (
        <div style={{ position: 'fixed', top: '100px', right: '20px', zIndex: 1000, background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 20px rgba(16,185,129,0.4)', animation: 'slideIn 0.3s ease-out' }}>
          ✅ {toast}
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @media (max-width: 640px) {
          .wishlist-wrap { padding-top: 80px !important; }
        }
      `}</style>
    </div>
  );
}
