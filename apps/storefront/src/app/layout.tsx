import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { fetchSiteConfig } from '@/lib/api';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-dm-sans' });
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { SiteConfigProvider } from '@/context/SiteConfigContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DummyDataBanner } from '@/components/DummyDataBanner';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';

const BASE = process.env.NEXT_PUBLIC_STOREFRONT_URL ?? 'http://localhost:3000';
const DEFAULT_SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Bag and Shop';

export const metadata: Metadata = {
  title: { default: DEFAULT_SITE_NAME, template: `%s | ${DEFAULT_SITE_NAME}` },
  description: 'Storefront',
  metadataBase: new URL(BASE),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: DEFAULT_SITE_NAME,
  },
};

const ChatbotWidget = dynamic(() => import('@/components/ChatbotWidget').then((m) => ({ default: m.ChatbotWidget })), { ssr: false });
const SocialWidget = dynamic(() => import('@/components/SocialWidget').then((m) => ({ default: m.SocialWidget })), { ssr: false });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteCopy = await fetchSiteConfig();
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] font-sans antialiased">
        <GoogleAnalytics />
        <DummyDataBanner />
        <SiteConfigProvider initialCopy={siteCopy}>
          <CartProvider>
            <AuthProvider>
              <Header />
              <div className="min-h-[calc(100vh-4rem)] flex flex-col">
                {children}
              </div>
              <Footer />
              <SocialWidget />
              <ChatbotWidget />
            </AuthProvider>
          </CartProvider>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
