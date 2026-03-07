import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import { SocialWidget } from '@/components/SocialWidget';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';

const BASE = process.env.NEXT_PUBLIC_STOREFRONT_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: { default: 'Bag and Shop', template: '%s | Bag and Shop' },
  description: 'Storefront',
  metadataBase: new URL(BASE),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Bag and Shop',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <GoogleAnalytics />
        <CartProvider>
          <AuthProvider>
            <Header />
            {children}
            <SocialWidget />
            <ChatbotWidget />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
