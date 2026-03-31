import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders',
  description: 'Track your orders and view order history on Meta Mart.',
  robots: { index: false, follow: false },
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
