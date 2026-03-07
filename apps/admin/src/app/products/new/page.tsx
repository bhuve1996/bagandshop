'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, type CategoryRecord, type ProductRecord } from '@/lib/api';

export default function NewProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [handle, setHandle] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [status, setStatus] = useState('draft');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [inventory, setInventory] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.categories.list().then(setCategories);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const h = handle || title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'product';
      const product = await api.products.create({
        handle: h,
        title: title || 'Untitled',
        description: description || null,
        category_id: categoryId || null,
        status,
        variants: [{ sku: sku || `sku-${Date.now()}`, price: price || '0', inventory_quantity: inventory }] as unknown as ProductRecord['variants'],
      });
      router.push(`/products/${product.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">New product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!handle) setHandle(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
            }}
            placeholder="Product title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Handle (URL slug)</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="product-handle"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea className="w-full border rounded px-3 py-2" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select className="w-full border rounded px-3 py-2" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="w-full border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Default variant</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">SKU</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Price</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Inventory</label>
              <input type="number" className="w-full border rounded px-3 py-2" value={inventory} onChange={(e) => setInventory(parseInt(e.target.value, 10) || 0)} />
            </div>
          </div>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Creating...' : 'Create'}
          </button>
          <Link href="/products" className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
