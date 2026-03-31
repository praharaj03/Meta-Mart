'use client';

import { SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(90deg, #e2e2e2, #c9d6ff)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Poppins, sans-serif',
    }}>
      <button
        onClick={() => router.push('/')}
        style={{
          position: 'fixed', top: '20px', left: '20px',
          background: '#7494ec', color: 'white', border: 'none',
          padding: '12px 20px', borderRadius: '25px', fontSize: '14px',
          fontWeight: 600, cursor: 'pointer', display: 'flex',
          alignItems: 'center', gap: '8px',
          boxShadow: '0 4px 12px rgba(116,148,236,0.3)',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        🏠 Home
      </button>
      <SignIn
        appearance={{
          variables: { colorPrimary: '#7494ec', fontFamily: 'Poppins, sans-serif', borderRadius: '8px' },
          elements: { card: { boxShadow: '0 0 30px rgba(0,0,0,0.2)', borderRadius: '30px' } },
        }}
        signUpUrl="/register"
      />
    </div>
  );
}
