"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const { items: cartItems, updateQuantity, removeItem } = useCart();
  const router = useRouter();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="floating-cart-elements">
          <div className="cart-element cart-element-1"></div>
          <div className="cart-element cart-element-2"></div>
          <div className="cart-element cart-element-3"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="cart-badge">
            <span>🛒 Shopping Cart</span>
          </div>
          <h1 className="cart-title">Your Cart</h1>
          <p className="cart-subtitle">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add some products to get started</p>
              <Link href="/shop" className="shop-now-btn">Continue Shopping</Link>
            </div>
          ) : (
            <div className="cart-grid">
              {/* Cart Items */}
              <div className="cart-items">
                <h2 className="section-title">Cart Items</h2>
                
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="product-image"
                      />
                    </div>
                    
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <div className="item-specs">
                        <span>Color: {item.color}</span>
                        <span>Size: {item.size}</span>
                      </div>
                      <div className="item-price">${item.price}</div>
                    </div>
                    
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="qty-btn qty-btn-minus"
                          disabled={item.quantity <= 1}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="qty-btn qty-btn-plus"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="remove-btn"
                        title="Remove item"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"></polyline>
                          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="order-summary">
                <h2 className="summary-title">Order Summary</h2>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="promo-code">
                  <input 
                    type="text" 
                    placeholder="Enter promo code"
                    className="promo-input"
                  />
                  <button className="promo-btn">Apply</button>
                </div>

                <button className="checkout-btn" onClick={() => router.push('/checkout')}>
                  <span>Proceed to Checkout</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>

                <div className="security-badges">
                  <div className="badge">🔒 Secure Checkout</div>
                  <div className="badge">✅ 30-Day Returns</div>
                  <div className="badge">🚚 Free Shipping $100+</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      
      <style jsx>{`
        .floating-cart-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .cart-element {
          position: absolute;
          background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
          border-radius: 50%;
          animation: cartFloat 10s ease-in-out infinite;
        }

        .cart-element-1 {
          width: 120px;
          height: 120px;
          top: 15%;
          left: 8%;
          animation-delay: 0s;
        }

        .cart-element-2 {
          width: 80px;
          height: 80px;
          top: 25%;
          right: 12%;
          animation-delay: 3s;
        }

        .cart-element-3 {
          width: 100px;
          height: 100px;
          bottom: 20%;
          left: 20%;
          animation-delay: 6s;
        }

        .cart-badge {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 50px;
          margin-bottom: 24px;
          animation: pulse 2s infinite;
        }

        .cart-badge span {
          font-size: 16px;
          font-weight: 600;
          color: #3b82f6;
        }

        .cart-title {
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 900;
          background: linear-gradient(135deg, #3b82f6, #9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 16px;
          animation: slideUp 0.8s ease-out;
        }

        .cart-subtitle {
          font-size: 1.25rem;
          color: #64748b;
          margin-bottom: 32px;
          animation: slideUp 0.8s ease-out 0.2s both;
        }

        .empty-cart {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.8s ease-out;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 24px;
        }

        .empty-cart h2 {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .empty-cart p {
          color: #64748b;
          font-size: 1.125rem;
          margin-bottom: 32px;
        }

        .shop-now-btn {
          background: linear-gradient(135deg, #3b82f6, #9333ea);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .shop-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .cart-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          align-items: start;
        }

        .cart-items {
          animation: slideUp 0.8s ease-out 0.4s both;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 24px;
        }

        .cart-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.1);
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }

        .cart-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(59, 130, 246, 0.15);
        }

        .item-image {
          flex-shrink: 0;
        }

        .product-image {
          width: 120px;
          height: 120px;
          object-cover: cover;
          border-radius: 12px;
        }

        .item-details {
          flex: 1;
        }

        .item-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .item-specs {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
        }

        .item-specs span {
          font-size: 14px;
          color: #64748b;
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 20px;
        }

        .item-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #3b82f6;
        }

        .item-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .qty-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #ffffff;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          border-right: 1px solid #e2e8f0;
        }

        .qty-btn:last-child {
          border-right: none;
          border-left: 1px solid #e2e8f0;
        }

        .qty-btn:hover:not(:disabled) {
          background: #3b82f6;
          color: white;
        }

        .qty-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .qty-btn-minus:hover:not(:disabled) {
          background: #ef4444;
        }

        .qty-btn-plus:hover:not(:disabled) {
          background: #10b981;
        }

        .quantity {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          min-width: 40px;
          text-align: center;
          padding: 8px 12px;
          background: white;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }

        .remove-btn {
          background: #fef2f2;
          color: #ef4444;
          border: 2px solid #fecaca;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .remove-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .order-summary {
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.1);
          height: fit-content;
          position: sticky;
          top: 120px;
          animation: slideUp 0.8s ease-out 0.6s both;
        }

        .summary-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 24px;
          text-align: center;
        }

        .summary-details {
          margin-bottom: 24px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          font-size: 16px;
        }

        .summary-row span:first-child {
          color: #64748b;
        }

        .summary-row span:last-child {
          font-weight: 600;
          color: #1e293b;
        }

        .summary-row.total {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .summary-row.total span {
          color: #3b82f6;
        }

        .summary-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 16px 0;
        }

        .promo-code {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }

        .promo-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .promo-input:focus {
          border-color: #3b82f6;
        }

        .promo-btn {
          background: #f1f5f9;
          color: #3b82f6;
          border: 2px solid #e2e8f0;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .promo-btn:hover {
          background: #3b82f6;
          color: white;
        }

        .checkout-btn {
          width: 100%;
          background: linear-gradient(135deg, #3b82f6, #9333ea);
          color: white;
          border: none;
          padding: 18px 24px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          margin-bottom: 24px;
        }

        .checkout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .security-badges {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .badge {
          font-size: 12px;
          color: #64748b;
          text-align: center;
          padding: 8px;
          background: #f8fafc;
          border-radius: 8px;
        }

        @keyframes cartFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(180deg); }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @media (max-width: 1024px) {
          .cart-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          
          .order-summary {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .cart-item {
            flex-direction: column;
            text-align: center;
          }
          
          .item-details {
            order: 2;
          }
          
          .item-controls {
            order: 3;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
          }
          
          .order-summary {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;