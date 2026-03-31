'use client';

import { SignIn, SignUp } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../login.css';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  return (
    <div className="login-page-body">
      <button onClick={() => router.push('/')} className="back-home-btn">
        🏠 Home
      </button>

      <div className={`container ${isRegister ? 'active' : ''}`}>
        {/* Login Form */}
        <div className="form-box login">
          <SignIn routing="hash" />
        </div>

        {/* Register Form */}
        <div className="form-box register">
          <SignUp routing="hash" />
        </div>

        {/* Toggle Panel */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don&apos;t have an account?</p>
            <button className="btn" onClick={() => setIsRegister(true)}>Register</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="btn" onClick={() => setIsRegister(false)}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
