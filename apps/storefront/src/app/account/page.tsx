'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/context/SiteConfigContext';
import { fetchMyOrders } from '@/lib/api';
import type { OrderRecord } from '@/lib/api';

export default function AccountPage() {
  const t = useT();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchMyOrders()
      .then(setOrders)
      .finally(() => setOrdersLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <main className="section-pad">
        <div className="container-narrow max-w-2xl">
          <p className="prose-custom">{t('account.loading')}</p>
        </div>
      </main>
    );
  }

  const totals = (o: OrderRecord) => (o.totals as Record<string, string>)?.total ?? '0';

  return (
    <main className="section-pad">
      <div className="container-narrow max-w-2xl">
        <h1 className="heading-2 text-[rgb(var(--color-foreground))] mb-2">{t('account.title')}</h1>
        <p className="prose-custom mb-8">{user.email} {user.name && `· ${user.name}`}</p>

        <h2 className="heading-3 text-[rgb(var(--color-foreground))] mb-4">{t('account.orderHistory')}</h2>
        {ordersLoading ? (
          <p className="prose-custom">{t('account.loadingOrders')}</p>
        ) : orders.length === 0 ? (
          <p className="prose-custom py-8">{t('account.noOrders')}</p>
        ) : (
          <ul className="divide-y divide-[rgb(var(--color-border))] rounded-lg border border-[rgb(var(--color-border))] overflow-hidden">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.order_number}${user?.email ? `?email=${encodeURIComponent(user.email)}` : ''}`}
                  className="flex justify-between items-center px-5 py-4 hover:bg-[rgb(var(--color-card))] transition-colors"
                >
                  <span className="font-medium text-[rgb(var(--color-foreground))]">{order.order_number}</span>
                  <span className="text-sm text-[rgb(var(--color-muted))]">
                    {new Date(order.created_at).toLocaleDateString()} · ${totals(order)} · {order.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8">
          <Link href="/collections" className="btn-outline">
            {t('cart.continueShopping')}
          </Link>
        </p>
      </div>
    </main>
  );
}
