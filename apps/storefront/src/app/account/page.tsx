'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchMyOrders } from '@/lib/api';
import type { OrderRecord } from '@/lib/api';

export default function AccountPage() {
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
      <main className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  const totals = (o: OrderRecord) => (o.totals as Record<string, string>)?.total ?? '0';

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">Account</h1>
      <p className="text-gray-600 mb-6">{user.email} {user.name && `· ${user.name}`}</p>

      <h2 className="font-semibold text-lg mb-4">Order history</h2>
      {ordersLoading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <ul className="divide-y border rounded-lg overflow-hidden">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.order_number}${user?.email ? `?email=${encodeURIComponent(user.email)}` : ''}`}
                className="flex justify-between items-center px-4 py-3 hover:bg-gray-50"
              >
                <span className="font-medium">{order.order_number}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(order.created_at).toLocaleDateString()} · ${totals(order)} · {order.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6">
        <Link href="/" className="text-blue-600 hover:underline">Continue shopping</Link>
      </p>
    </main>
  );
}
