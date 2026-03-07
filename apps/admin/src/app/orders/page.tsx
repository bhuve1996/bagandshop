'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type OrderRecord } from '@/lib/api';

export default function OrdersList() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders.list().then(setOrders).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <ul className="bg-white rounded-lg shadow divide-y">
        {orders.map((o) => (
          <li key={o.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <span className="font-medium">{o.order_number}</span>
              <span className="text-gray-500 ml-2">{o.email ?? 'No email'}</span>
              <span className="text-sm text-gray-400 ml-2">{o.status}</span>
            </div>
            <span className="text-sm text-gray-500">
              {(o.totals as Record<string, string>)?.total ? `$${(o.totals as Record<string, string>).total}` : ''}
            </span>
            <Link href={`/orders/${o.id}`} className="text-blue-600 hover:underline">
              View
            </Link>
          </li>
        ))}
      </ul>
      {!loading && orders.length === 0 && (
        <p className="text-gray-500 mt-4">No orders yet.</p>
      )}
    </div>
  );
}
