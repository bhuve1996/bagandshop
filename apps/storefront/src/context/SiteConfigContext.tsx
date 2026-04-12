'use client';

import { createContext, useContext, useMemo } from 'react';
import { DEFAULT_SITE_COPY } from '@bagandshop/shared';

export type SiteCopy = Record<string, string>;

const SiteConfigContext = createContext<{ copy: SiteCopy } | null>(null);

export function SiteConfigProvider({
  children,
  initialCopy,
}: {
  children: React.ReactNode;
  initialCopy: Record<string, string>;
}) {
  const value = useMemo(() => {
    const merged: Record<string, string> = { ...DEFAULT_SITE_COPY };
    for (const [key, val] of Object.entries(initialCopy)) {
      if (val != null && String(val).trim() !== '') merged[key] = val;
    }
    return { copy: merged };
  }, [initialCopy]);
  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): { copy: SiteCopy } {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    return { copy: DEFAULT_SITE_COPY };
  }
  return ctx;
}

/** Short helper: t('nav.cart') => copy['nav.cart'] ?? key */
export function useT() {
  const { copy } = useSiteConfig();
  return (key: string) => copy[key] ?? key;
}
