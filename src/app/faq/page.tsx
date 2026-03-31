"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Meta Mart?",
      answer: "Meta Mart is a premium e-commerce platform offering carefully curated products that enhance your lifestyle with innovation and luxury.",
      icon: "🛍️"
    },
    {
      question: "How do I place an order?",
      answer: "Simply browse our products, add items to your cart, and proceed to checkout. We accept all major payment methods and provide secure transactions.",
      icon: "📦"
    },
    {
      question: "What are your shipping options?",
      answer: "We offer free standard shipping on orders over $50, express shipping (2-3 days), and overnight delivery. International shipping is available to 50+ countries.",
      icon: "🚚"
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day hassle-free return policy. Items must be in original condition with tags attached. Return shipping is free for defective items.",
      icon: "↩️"
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes! Our 24/7 customer support team is available via live chat, email, or phone. We're committed to providing exceptional service.",
      icon: "💬"
    },
    {
      question: "Are your products authentic?",
      answer: "Absolutely! We guarantee 100% authentic products. All items are sourced directly from authorized dealers and come with authenticity certificates.",
      icon: "✅"
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="hero-badge">
            <span>❓ Got Questions?</span>
          </div>
          <h1 className="faq-title">
            Frequently Asked Questions
          </h1>
          <p className="faq-subtitle">
            Find answers to common questions about Meta Mart
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="question-content">
                    <span className="faq-icon">{faq.icon}</span>
                    <span className="question-text">{faq.question}</span>
                  </div>
                  <div className={`faq-toggle ${activeIndex === index ? 'rotate' : ''}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
                
                <div className={`faq-answer ${activeIndex === index ? 'open' : ''}`}>
                  <div className="answer-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="contact-cta">
            <div className="cta-content">
              <h3>Still have questions?</h3>
              <p>Our support team is here to help you 24/7</p>
              <div className="cta-buttons">
                <button className="btn-primary" onClick={() => alert('🚀 Live Chat coming soon! Stay tuned.')}>
                  <span>💬</span>
                  Live Chat
                </button>
                <a href="mailto:devopspraharaj25@gmail.com" className="btn-secondary">
                  <span>📧</span>
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <style jsx>{`
        .floating-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 80px;
          height: 80px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 120px;
          height: 120px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 60px;
          height: 60px;
          top: 40%;
          left: 80%;
          animation-delay: 4s;
        }

        .hero-badge {
          display: inline-block;
          padding: 8px 20px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 50px;
          margin-bottom: 24px;
          animation: pulse 2s infinite;
        }

        .hero-badge span {
          font-size: 14px;
          font-weight: 600;
          color: #7c3aed;
        }

        .faq-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 16px;
          animation: slideUp 0.8s ease-out;
        }

        .faq-subtitle {
          font-size: 1.25rem;
          color: #64748b;
          margin-bottom: 32px;
          animation: slideUp 0.8s ease-out 0.2s both;
        }

        .faq-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-item {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          transition: all 0.3s ease;
          animation: slideUp 0.6s ease-out both;
          border: 1px solid rgba(139, 92, 246, 0.1);
        }

        .faq-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.15);
        }

        .faq-item.active {
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.2);
        }

        .faq-question {
          width: 100%;
          padding: 24px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }

        .faq-question:hover {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05));
        }

        .question-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .faq-icon {
          font-size: 24px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          border-radius: 12px;
          animation: bounce 2s infinite;
        }

        .question-text {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .faq-toggle {
          color: #7c3aed;
          transition: transform 0.3s ease;
        }

        .faq-toggle.rotate {
          transform: rotate(180deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .faq-answer.open {
          max-height: 200px;
        }

        .answer-content {
          padding: 0 24px 24px 88px;
        }

        .answer-content p {
          color: #64748b;
          line-height: 1.6;
          font-size: 16px;
        }

        .contact-cta {
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          border-radius: 24px;
          padding: 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .contact-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.1;
        }

        .cta-content {
          position: relative;
          z-index: 2;
        }

        .cta-content h3 {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }

        .cta-content p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 18px;
          margin-bottom: 32px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary {
          padding: 16px 32px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 16px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: white;
          color: #7c3aed;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        @media (max-width: 768px) {
          .answer-content {
            padding: 0 24px 24px 24px;
          }
          
          .question-content {
            gap: 12px;
          }
          
          .faq-icon {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }
          
          .contact-cta {
            padding: 32px 24px;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .btn-primary, .btn-secondary {
            width: 100%;
            max-width: 200px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default FAQPage;