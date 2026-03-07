'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/context/SiteConfigContext';
import { authLogout } from '@/lib/api';

export function Header() {
  const t = useT();
  const { items } = useCart();
  const { user, loading, setUser, setToken } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleLogout = async () => {
    await authLogout();
    setUser(null);
    setToken(null);
    setMobileOpen(false);
  };

  const navLinks = (
    <>
      <Link href="/collections" className="text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] font-medium transition-colors" onClick={() => setMobileOpen(false)}>
        {t('nav.collections')}
      </Link>
      <Link href="/combos" className="text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] font-medium transition-colors" onClick={() => setMobileOpen(false)}>
        {t('nav.combos')}
      </Link>
    </>
  );

  const authLinks = !loading && (
    user ? (
      <>
        <Link href="/account" className="text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] font-medium transition-colors" onClick={() => setMobileOpen(false)}>
          {t('nav.account')}
        </Link>
        <button type="button" onClick={handleLogout} className="text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] font-medium transition-colors text-left">
          {t('nav.logout')}
        </button>
      </>
    ) : (
      <>
        <Link href="/login" className="text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] font-medium transition-colors" onClick={() => setMobileOpen(false)}>
          {t('nav.login')}
        </Link>
        <Link href="/register" className="text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] font-medium transition-colors" onClick={() => setMobileOpen(false)}>
          {t('nav.register')}
        </Link>
      </>
    )
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgb(var(--color-border))] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-narrow flex h-16 items-center justify-between gap-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-[rgb(var(--color-foreground))] shrink-0" onClick={() => setMobileOpen(false)}>
          {t('site.name')}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks}
        </nav>

        <div className="hidden md:flex items-center gap-6 ml-auto">
          {authLinks}
          <Link href="/cart" className="relative flex items-center gap-2 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] font-medium transition-colors" onClick={() => setMobileOpen(false)}>
            <span className="sr-only">{t('nav.cart')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[rgb(var(--color-accent))] px-1.5 text-xs font-semibold text-white">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/cart" className="relative p-2 text-[rgb(var(--color-foreground))]" onClick={() => setMobileOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute top-0 right-0 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[rgb(var(--color-accent))] text-[10px] font-bold text-white">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="p-2 text-[rgb(var(--color-foreground))] hover:bg-black/5 rounded-lg transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[rgb(var(--color-border))] bg-white">
          <nav className="container-narrow py-4 flex flex-col gap-4">
            <Link href="/collections" className="py-2 font-medium" onClick={() => setMobileOpen(false)}>{t('nav.collections')}</Link>
            <Link href="/combos" className="py-2 font-medium" onClick={() => setMobileOpen(false)}>{t('nav.combos')}</Link>
            <div className="border-t border-[rgb(var(--color-border))] pt-4 flex flex-col gap-2">
              {authLinks}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
