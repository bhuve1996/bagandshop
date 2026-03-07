'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type CategoryRecord } from '@/lib/api';

export default function CategoriesList() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories.list().then(setCategories).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/categories/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          New category
        </Link>
      </div>
      <ul className="bg-white rounded-lg shadow divide-y">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <span className="font-medium">{c.name}</span>
              <span className="text-gray-500 ml-2">/{c.slug}</span>
            </div>
            <Link href={`/categories/${c.id}/edit`} className="text-blue-600 hover:underline">
              Edit
            </Link>
          </li>
        ))}
      </ul>
      {categories.length === 0 && (
        <p className="text-gray-500 mt-4">No categories yet.</p>
      )}
    </div>
  );
}
