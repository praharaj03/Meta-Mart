import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Secure checkout powered by Stripe at Meta Mart.',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
