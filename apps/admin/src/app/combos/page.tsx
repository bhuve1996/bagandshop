'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type ComboRecord } from '@/lib/api';

export default function CombosList() {
  const [combos, setCombos] = useState<ComboRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    api.combos.list(filterStatus || undefined).then(setCombos).finally(() => setLoading(false));
  }, [filterStatus]);

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Combos</h1>
        <Link href="/combos/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          New combo
        </Link>
      </div>
      <div className="mb-4">
        <select
          className="border rounded px-3 py-2"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
        </select>
      </div>
      <ul className="bg-white rounded-lg shadow divide-y">
        {combos.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <span className="font-medium">{c.title}</span>
              <span className="text-gray-500 ml-2">/{c.handle}</span>
              <span className="text-sm text-gray-400 ml-2">({c.status})</span>
              {c.items?.length ? (
                <span className="text-sm text-gray-500 ml-2">· {c.items.length} items</span>
              ) : null}
            </div>
            <Link href={`/combos/${c.id}/edit`} className="text-blue-600 hover:underline">
              Edit
            </Link>
          </li>
        ))}
      </ul>
      {!loading && combos.length === 0 && (
        <p className="text-gray-500 mt-4">No combos yet.</p>
      )}
    </div>
  );
}
