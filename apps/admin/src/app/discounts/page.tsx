'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type DiscountCodeRecord } from '@/lib/api';

export default function DiscountsPage() {
  const [list, setList] = useState<DiscountCodeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.discounts.list().then(setList).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Discount codes</h1>
        <Link href="/discounts/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          New code
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Code</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Value</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Min order</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Usage</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Valid</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-2 font-mono">{d.code}</td>
                  <td className="px-4 py-2">{d.type}</td>
                  <td className="px-4 py-2">{d.type === 'percent' ? `${d.value}%` : `$${d.value}`}</td>
                  <td className="px-4 py-2">${d.min_order}</td>
                  <td className="px-4 py-2">{d.used_count}{d.usage_limit != null ? ` / ${d.usage_limit}` : ''}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {d.valid_from ? new Date(d.valid_from).toLocaleDateString() : '—'} – {d.valid_until ? new Date(d.valid_until).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/discounts/${d.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-6 text-gray-500">No discount codes. Create one to use at checkout.</p>}
        </div>
      )}
    </div>
  );
}
