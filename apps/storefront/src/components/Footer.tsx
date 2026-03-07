'use client';

import Link from 'next/link';
import { useT } from '@/context/SiteConfigContext';

export function Footer() {
  const t = useT();

  return (
    <footer className="border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
      <div className="container-narrow section-pad">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-bold text-[rgb(var(--color-foreground))]">
              {t('site.name')}
            </Link>
            <p className="mt-3 text-sm text-[rgb(var(--color-muted))] max-w-xs">
              Quality products, fast delivery. Shop with confidence.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[rgb(var(--color-foreground))] mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/collections" className="text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors">{t('nav.collections')}</Link></li>
              <li><Link href="/combos" className="text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors">{t('nav.combos')}</Link></li>
              <li><Link href="/cart" className="text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors">{t('nav.cart')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[rgb(var(--color-foreground))] mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors">{t('nav.login')}</Link></li>
              <li><Link href="/register" className="text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors">{t('nav.register')}</Link></li>
              <li><Link href="/account" className="text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors">{t('nav.account')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[rgb(var(--color-foreground))] mb-4">Support</h3>
            <p className="text-sm text-[rgb(var(--color-muted))]">
              Free shipping on orders over $50. Easy returns within 30 days.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[rgb(var(--color-border))] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
            © {new Date().getFullYear()} {t('site.name')}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-[rgb(var(--color-muted-foreground))]">
            <span>Secure checkout</span>
            <span>SSL encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
