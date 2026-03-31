'use client';

import React, { createContext, useContext, useState } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
}

const CartContext = createContext<{
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}>({
  items: [],
  addToCart: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1, color: 'Default', size: 'Standard' }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.id !== id));
    } else {
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);