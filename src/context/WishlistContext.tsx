'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  badge: string;
  rating: number;
}

const WishlistContext = createContext<{
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  has: (id: string) => boolean;
  clear: () => void;
}>({ items: [], toggle: () => {}, has: () => false, clear: () => {} });

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('metamart_wishlist');
      if (saved) setItems(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const save = (next: WishlistItem[]) => {
    setItems(next);
    localStorage.setItem('metamart_wishlist', JSON.stringify(next));
  };

  const toggle = (item: WishlistItem) => {
    setItems(prev => {
      const next = prev.find(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item];
      localStorage.setItem('metamart_wishlist', JSON.stringify(next));
      return next;
    });
  };

  const has = (id: string) => items.some(i => i.id === id);

  const clear = () => {
    setItems([]);
    localStorage.removeItem('metamart_wishlist');
  };

  return (
    <WishlistContext.Provider value={{ items, toggle, has, clear }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
