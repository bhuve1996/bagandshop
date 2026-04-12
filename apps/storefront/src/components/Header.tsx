'use client';

import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [mobileDrawerTop, setMobileDrawerTop] = useState(64);
  const topBarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuPortalRef = useRef<HTMLDivElement>(null);
  const [portalReady, setPortalReady] = useState(false);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useLayoutEffect(() => {
    if (!mobileOpen) return;
    const el = topBarRef.current;
    if (!el) return;
    const sync = () => setMobileDrawerTop(el.getBoundingClientRect().bottom);
    sync();
    window.addEventListener('resize', sync);
    window.addEventListener('scroll', sync, true);
    return () => {
      window.removeEventListener('resize', sync);
      window.removeEventListener('scroll', sync, true);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const storefrontScroll = document.getElementById('storefront-scroll');

    const prev = {
      htmlPosition: html.style.position,
      htmlTop: html.style.top,
      htmlLeft: html.style.left,
      htmlRight: html.style.right,
      htmlWidth: html.style.width,
      htmlHeight: html.style.height,
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
    };

    html.classList.add('drawer-scroll-lock');

    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    html.style.position = 'fixed';
    html.style.top = `-${scrollY}px`;
    html.style.left = '0';
    html.style.right = '0';
    html.style.width = '100%';
    html.style.height = '100%';

    body.style.overflow = 'hidden';
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';

    let storefrontPrevOverflow = '';
    if (storefrontScroll) {
      storefrontPrevOverflow = storefrontScroll.style.overflow;
      storefrontScroll.style.overflow = 'hidden';
    }

    const isInsideOpenMenu = (ev: TouchEvent | WheelEvent): boolean => {
      const h = headerRef.current;
      const p = mobileMenuPortalRef.current;
      const path = typeof ev.composedPath === 'function' ? ev.composedPath() : [ev.target];
      for (const node of path) {
        if (!(node instanceof Node)) continue;
        if (p?.contains(node)) return true;
        if (h?.contains(node)) return true;
      }
      return false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isInsideOpenMenu(e)) return;
      e.preventDefault();
    };

    const onWheel = (e: WheelEvent) => {
      if (isInsideOpenMenu(e)) return;
      e.preventDefault();
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });

    return () => {
      window.removeEventListener('touchmove', onTouchMove, { capture: true });
      window.removeEventListener('wheel', onWheel, { capture: true });

      html.classList.remove('drawer-scroll-lock');
      if (storefrontScroll) {
        storefrontScroll.style.overflow = storefrontPrevOverflow;
      }

      html.style.position = prev.htmlPosition;
      html.style.top = prev.htmlTop;
      html.style.left = prev.htmlLeft;
      html.style.right = prev.htmlRight;
      html.style.width = prev.htmlWidth;
      html.style.height = prev.htmlHeight;
      html.style.overflow = prev.htmlOverflow;
      html.style.overscrollBehavior = prev.htmlOverscroll;
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.left = prev.bodyLeft;
      body.style.right = prev.bodyRight;
      body.style.width = prev.bodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await authLogout();
    setUser(null);
    setToken(null);
    setMobileOpen(false);
  };

  const navLinkClassDesktop =
    'font-medium transition-colors text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] py-2 md:py-0';

  const navLinkClassMobile =
    'block w-full py-3 text-left text-base font-medium text-[rgb(var(--color-foreground))] rounded-lg px-2 -mx-2 hover:bg-black/5 active:bg-black/10';

  const navLinksDesktop = (
    <>
      <Link href="/collections" className={navLinkClassDesktop} onClick={() => setMobileOpen(false)}>
        {t('nav.collections')}
      </Link>
      <Link href="/combos" className={navLinkClassDesktop} onClick={() => setMobileOpen(false)}>
        {t('nav.combos')}
      </Link>
      <Link href="/track-order" className={navLinkClassDesktop} onClick={() => setMobileOpen(false)}>
        {t('nav.trackOrder')}
      </Link>
    </>
  );

  const navLinksMobile = (
    <>
      <Link href="/collections" className={navLinkClassMobile} onClick={() => setMobileOpen(false)}>
        {t('nav.collections')}
      </Link>
      <Link href="/combos" className={navLinkClassMobile} onClick={() => setMobileOpen(false)}>
        {t('nav.combos')}
      </Link>
      <Link href="/track-order" className={navLinkClassMobile} onClick={() => setMobileOpen(false)}>
        {t('nav.trackOrder')}
      </Link>
    </>
  );

  const authLinks = !loading && (
    user ? (
      <>
        <Link href="/account" className="font-medium transition-colors text-[rgb(var(--color-foreground))] hover:bg-black/5 md:hover:bg-transparent md:text-[rgb(var(--color-muted))] md:hover:text-[rgb(var(--color-foreground))] rounded-lg px-2 -mx-2 md:px-0 md:mx-0 md:py-0 py-3 block md:inline" onClick={() => setMobileOpen(false)}>
          {t('nav.account')}
        </Link>
        <button type="button" onClick={handleLogout} className="font-medium transition-colors text-left text-[rgb(var(--color-foreground))] hover:bg-black/5 md:hover:bg-transparent md:text-[rgb(var(--color-muted))] md:hover:text-[rgb(var(--color-foreground))] rounded-lg px-2 -mx-2 md:px-0 md:mx-0 md:py-0 py-3 w-full md:w-auto">
          {t('nav.logout')}
        </button>
      </>
    ) : (
      <>
        <Link href="/login" className="font-medium transition-colors text-[rgb(var(--color-foreground))] hover:bg-black/5 md:hover:bg-transparent md:text-[rgb(var(--color-muted))] md:hover:text-[rgb(var(--color-foreground))] rounded-lg px-2 -mx-2 md:px-0 md:mx-0 md:py-0 py-3 block md:inline" onClick={() => setMobileOpen(false)}>
          {t('nav.login')}
        </Link>
        <Link href="/register" className="font-medium transition-colors text-[rgb(var(--color-foreground))] hover:bg-black/5 md:hover:bg-transparent md:text-[rgb(var(--color-muted))] md:hover:text-[rgb(var(--color-foreground))] rounded-lg px-2 -mx-2 md:px-0 md:mx-0 md:py-0 py-3 block md:inline" onClick={() => setMobileOpen(false)}>
          {t('nav.register')}
        </Link>
      </>
    )
  );

  const portalMount =
    portalReady && mobileOpen && typeof document !== 'undefined'
      ? document.getElementById('mobile-menu-portal')
      : null;

  const mobileMenuPortal =
    portalMount &&
    createPortal(
      <div
        ref={mobileMenuPortalRef}
        data-mobile-drawer-root
        className="fixed inset-0 md:hidden isolate"
      >
        <button
          type="button"
          className="absolute inset-0 z-0 touch-none bg-black/40 overscroll-none"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          onWheel={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
        />
        <nav
          data-mobile-drawer-panel
          className="absolute left-0 right-0 bottom-0 z-[1] flex touch-pan-y flex-col overflow-y-auto overscroll-contain border-t border-[rgb(var(--color-border))] bg-white shadow-lg"
          style={{ top: mobileDrawerTop }}
          aria-label="Mobile navigation"
        >
          <div className="container-narrow flex flex-col py-2 pb-6">
            {navLinksMobile}
            <div className="my-2 border-t border-[rgb(var(--color-border))]" />
            <Link href="/cart" className={navLinkClassMobile} onClick={() => setMobileOpen(false)}>
              {t('nav.cart')}
            </Link>
            <div className="my-2 border-t border-[rgb(var(--color-border))]" />
            <div className="flex flex-col gap-0">{authLinks}</div>
          </div>
        </nav>
      </div>,
      portalMount,
    );

  return (
    <>
    <header
      ref={headerRef}
      className={`sticky top-0 w-full border-b border-[rgb(var(--color-border))] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 ${
        mobileOpen ? 'z-[100000]' : 'z-[100]'
      }`}
    >
      <div
        ref={topBarRef}
        className="relative z-[10] container-narrow flex h-16 items-center justify-between gap-6 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
      >
        <Link href="/" className="text-xl font-bold tracking-tight text-[rgb(var(--color-foreground))] shrink-0" onClick={() => setMobileOpen(false)}>
          {t('site.name')}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 shrink-0">
          {navLinksDesktop}
        </nav>

        <div className="hidden md:flex items-center gap-6 ml-auto">
          {authLinks}
          <Link href="/cart" className="relative flex items-center gap-2 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] font-medium transition-colors" onClick={() => setMobileOpen(false)}>
            <span className="sr-only">
              {t('nav.cart')}, {count}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span
              className={
                count > 0
                  ? 'absolute -top-2 -right-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[rgb(var(--color-accent))] px-1.5 text-xs font-semibold text-white'
                  : 'absolute -top-2 -right-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[rgb(var(--color-border))] px-1.5 text-xs font-semibold text-[rgb(var(--color-muted))]'
              }
              aria-hidden
            >
              {count > 99 ? '99+' : count}
            </span>
          </Link>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/cart" className="relative p-2 text-[rgb(var(--color-foreground))]" onClick={() => setMobileOpen(false)}>
            <span className="sr-only">
              {t('nav.cart')}, {count}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span
              className={
                count > 0
                  ? 'absolute top-0 right-0 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[rgb(var(--color-accent))] text-[10px] font-bold text-white'
                  : 'absolute top-0 right-0 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[rgb(var(--color-border))] text-[10px] font-bold text-[rgb(var(--color-muted))]'
              }
              aria-hidden
            >
              {count > 99 ? '99+' : count}
            </span>
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
    </header>
    {mobileMenuPortal}
    </>
  );
}
