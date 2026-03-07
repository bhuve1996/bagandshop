'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type PageRecord } from '@/lib/api';

export default function PagesList() {
  const [pages, setPages] = useState<PageRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.pages.list().then(setPages).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pages</h1>
        <Link
          href="/pages/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          New page
        </Link>
      </div>
      <ul className="bg-white rounded-lg shadow divide-y">
        {pages.map((p) => (
          <li key={p.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <span className="font-medium">{p.title}</span>
              <span className="text-gray-500 ml-2">/{p.slug}</span>
              <span className="text-sm text-gray-400 ml-2">({p.template_type})</span>
            </div>
            <Link
              href={`/pages/${p.id}/edit`}
              className="text-blue-600 hover:underline"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
      {pages.length === 0 && (
        <p className="text-gray-500 mt-4">No pages yet. Create one or run API seed.</p>
      )}
    </div>
  );
}
