'use client';

import { useEffect, useRef } from 'react';
import { trackPurchase } from '@/lib/analytics';

export function PurchaseTracker({ orderNumber, value }: { orderNumber: string; value?: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackPurchase({ order_number: orderNumber, value, currency: 'USD' });
  }, [orderNumber, value]);
  return null;
}
