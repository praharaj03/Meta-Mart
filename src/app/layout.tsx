import type { Metadata } from 'next';
import "./globals.css";
import ClientProviders from '../components/ClientProviders';

export const metadata: Metadata = {
  title: {
    default: 'Meta Mart — Premium Online Shopping',
    template: '%s | Meta Mart',
  },
  description: 'Meta Mart is a modern e-commerce store offering premium electronics, fashion, home decor, gaming gear, and more. Fast delivery, secure payments, and unbeatable prices.',
  keywords: ['Meta Mart', 'online shopping', 'electronics', 'fashion', 'gaming', 'e-commerce', 'buy online', 'premium products'],
  authors: [{ name: 'Meta Mart' }],
  creator: 'Meta Mart',
  metadataBase: new URL('https://meta-mart.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://meta-mart.vercel.app',
    siteName: 'Meta Mart',
    title: 'Meta Mart — Premium Online Shopping',
    description: 'Discover premium products at unbeatable prices. Electronics, fashion, gaming gear and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Meta Mart — Premium Online Shopping',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meta Mart — Premium Online Shopping',
    description: 'Discover premium products at unbeatable prices.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: { url: '/favicon.svg', type: 'image/svg+xml' },
    apple: '/logo.png',
    shortcut: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
