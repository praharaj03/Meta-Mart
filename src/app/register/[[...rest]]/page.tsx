import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { CLERK_ENABLED } from '@/config/clerk';

export default function RegisterPage() {
  if (!CLERK_ENABLED) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#f4f8f4', background: '#08070d', textAlign: 'center', padding: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Account creation is currently disabled</h1>
          <p style={{ color: '#a1a1aa', marginTop: '8px' }}>You can continue shopping as a guest.</p>
          <Link href="/shop" style={{ display: 'inline-block', marginTop: '20px', color: '#86efac' }}>Continue shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <SignUp signInUrl="/login" />
    </div>
  );
}
