'use client';

import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo-container">
          <div className="logo-text">
            Meta<span className="logo-accent">Mart</span>
          </div>
          <div className="logo-tagline">Premium Shopping Experience</div>
        </div>
        
        <div className="loading-animation">
          <div className="spinner"></div>
          <div className="orbit orbit-1"></div>
          <div className="orbit orbit-2"></div>
          <div className="orbit orbit-3"></div>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">{Math.round(progress)}%</div>
        </div>
      </div>

      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: ${progress >= 100 ? 'fadeOut 0.5s ease-out forwards' : 'none'};
        }

        .loading-content {
          text-align: center;
          color: white;
        }

        .logo-container {
          margin-bottom: 60px;
          animation: slideDown 1s ease-out;
        }

        .logo-text {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 10px;
          background: linear-gradient(45deg, #fff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: glow 2s ease-in-out infinite alternate;
        }

        .logo-accent {
          color: #60a5fa;
          text-shadow: 0 0 20px rgba(96, 165, 250, 0.5);
        }

        .logo-tagline {
          font-size: 1.2rem;
          opacity: 0.8;
          font-weight: 300;
          letter-spacing: 2px;
        }

        .loading-animation {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 60px;
        }

        .spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60px;
          height: 60px;
          margin: -30px 0 0 -30px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid #60a5fa;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .orbit {
          position: absolute;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          animation: orbit 3s linear infinite;
        }

        .orbit-1 {
          width: 80px;
          height: 80px;
          top: 20px;
          left: 20px;
          animation-duration: 2s;
        }

        .orbit-2 {
          width: 100px;
          height: 100px;
          top: 10px;
          left: 10px;
          animation-duration: 3s;
          animation-direction: reverse;
        }

        .orbit-3 {
          width: 120px;
          height: 120px;
          top: 0;
          left: 0;
          animation-duration: 4s;
        }

        .progress-container {
          width: 300px;
          margin: 0 auto;
          animation: slideUp 1s ease-out 0.5s both;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #60a5fa, #a78bfa);
          border-radius: 10px;
          transition: width 0.3s ease;
          box-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
        }

        .progress-text {
          font-size: 1.1rem;
          font-weight: 600;
          opacity: 0.9;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes glow {
          0% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
          100% { text-shadow: 0 0 30px rgba(96, 165, 250, 0.8); }
        }

        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;