import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review your selected items and proceed to checkout at Meta Mart.',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
