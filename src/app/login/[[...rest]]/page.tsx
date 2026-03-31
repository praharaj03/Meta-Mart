import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <SignIn signUpUrl="/register" />
    </div>
  );
}
