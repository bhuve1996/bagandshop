'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useT } from '@/context/SiteConfigContext';

export default function CartPage() {
  const t = useT();
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <main className="section-pad">
        <div className="container-narrow max-w-xl text-center">
          <h1 className="heading-2 text-[rgb(var(--color-foreground))] mb-4">{t('cart.title')}</h1>
          <p className="prose-custom mb-8">{t('cart.empty')}</p>
          <Link href="/collections" className="btn-primary">
            {t('cart.continueShopping')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section-pad">
      <div className="container-narrow max-w-3xl">
        <h1 className="heading-2 text-[rgb(var(--color-foreground))] mb-8">{t('cart.title')}</h1>
        <ul className="divide-y divide-[rgb(var(--color-border))]">
          {items.map((item) => (
            <li key={item.key} className="py-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-[rgb(var(--color-foreground))]">{item.title}</p>
                <p className="text-sm text-[rgb(var(--color-muted))]">${item.price} × {item.quantity}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <input
                  type="number"
                  min={1}
                  className="input-base w-20 text-center"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.key, parseInt(e.target.value, 10) || 1)}
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  {t('cart.remove')}
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 pt-8 border-t border-[rgb(var(--color-border))] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-lg font-semibold text-[rgb(var(--color-foreground))]">
            {t('cart.total')}: ${total.toFixed(2)}
          </p>
          <Link href="/checkout" className="btn-primary w-full sm:w-auto">
            {t('cart.checkout')}
          </Link>
        </div>
      </div>
    </main>
  );
}
