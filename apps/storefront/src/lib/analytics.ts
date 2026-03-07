/**
 * Provider-agnostic analytics. Set NEXT_PUBLIC_GA_ID to enable Google Analytics.
 * Extend with other providers (e.g. custom endpoint) via env.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_GA_ID : undefined;

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (GA_ID && window.gtag) {
    window.gtag('event', name, params);
  }
}

export function trackPageView(path: string, title?: string): void {
  if (typeof window === 'undefined') return;
  if (GA_ID && window.gtag) {
    window.gtag('event', 'page_view', { page_path: path, page_title: title });
  }
}

export function trackAddToCart(params: { item_id?: string; item_name?: string; price?: string; quantity?: number }): void {
  trackEvent('add_to_cart', params);
}

export function trackPurchase(params: { order_number: string; value?: string; currency?: string }): void {
  trackEvent('purchase', params);
}
