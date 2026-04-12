'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useT } from '@/context/SiteConfigContext';

export default function TrackOrderPage() {
  const t = useT();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = orderNumber.trim();
    const em = email.trim();
    if (!num || !em) {
      setError(t('trackOrder.missingFields'));
      return;
    }
    setError('');
    router.push(`/orders/${encodeURIComponent(num)}?email=${encodeURIComponent(em)}`);
  };

  return (
    <main className="section-pad flex items-center justify-center min-h-[60vh]">
      <div className="container-narrow max-w-md">
        <div className="card p-8 md:p-10">
          <h1 className="heading-2 text-[rgb(var(--color-foreground))] mb-2">{t('trackOrder.title')}</h1>
          <p className="text-sm text-[rgb(var(--color-muted))] mb-6">{t('trackOrder.description')}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="track-order-number" className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-1">
                {t('trackOrder.orderNumber')}
              </label>
              <input
                id="track-order-number"
                type="text"
                autoComplete="off"
                className="input"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="track-order-email" className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-1">
                {t('trackOrder.email')}
              </label>
              <input
                id="track-order-email"
                type="email"
                autoComplete="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button type="submit" className="btn-primary w-full">
              {t('trackOrder.submit')}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[rgb(var(--color-muted))]">
            <Link href="/account" className="font-semibold text-[rgb(var(--color-accent))] hover:underline">
              {t('nav.account')}
            </Link>
            {' · '}
            <Link href="/" className="font-semibold text-[rgb(var(--color-accent))] hover:underline">
              {t('cart.continueShopping')}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
