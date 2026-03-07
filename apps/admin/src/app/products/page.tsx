'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type ProductRecord, type CategoryRecord } from '@/lib/api';

export default function ProductsList() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    api.categories.list().then(setCategories);
  }, []);

  useEffect(() => {
    const cat = filterCategory === '' ? undefined : filterCategory === '_null' ? null : filterCategory;
    const status = filterStatus || undefined;
    api.products.list(cat, status).then(setProducts).finally(() => setLoading(false));
  }, [filterCategory, filterStatus]);

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/products/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          New product
        </Link>
      </div>
      <div className="flex gap-4 mb-4">
        <select
          className="border rounded px-3 py-2"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All categories</option>
          <option value="_null">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
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
        {products.map((p) => (
          <li key={p.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <span className="font-medium">{p.title}</span>
              <span className="text-gray-500 ml-2">/{p.handle}</span>
              <span className="text-sm text-gray-400 ml-2">({p.status})</span>
            </div>
            <Link href={`/products/${p.id}/edit`} className="text-blue-600 hover:underline">
              Edit
            </Link>
          </li>
        ))}
      </ul>
      {!loading && products.length === 0 && (
        <p className="text-gray-500 mt-4">No products yet.</p>
      )}
    </div>
  );
}
