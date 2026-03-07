'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, type ProductRecord, type CategoryRecord, type VariantRecord } from '@/lib/api';

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [title, setTitle] = useState('');
  const [handle, setHandle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [status, setStatus] = useState('draft');
  const [variants, setVariants] = useState<VariantRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.categories.list().then(setCategories);
  }, []);

  useEffect(() => {
    if (!id) return;
    api.products.get(id).then((p) => {
      setProduct(p);
      setTitle(p.title);
      setHandle(p.handle);
      setDescription(p.description ?? '');
      setCategoryId(p.category_id ?? '');
      setStatus(p.status);
      setVariants(p.variants ?? []);
    }).catch(() => setProduct(null)).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setSaving(true);
    try {
      await api.products.update(id, {
        title,
        handle,
        description: description || null,
        category_id: categoryId || null,
        status,
        variants: variants.map((v) => ({
          id: v.id,
          product_id: id,
          sku: v.sku,
          title: v.title,
          option_values: v.option_values ?? {},
          price: v.price,
          compare_at_price: v.compare_at_price,
          inventory_quantity: v.inventory_quantity,
          media_ids: v.media_ids,
        })),
      });
      const updated = await api.products.get(id);
      setProduct(updated);
      setVariants(updated.variants ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const updateVariant = (index: number, updates: Partial<VariantRecord>) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  if (loading || !product) {
    return (
      <div className="p-8">
        {!product && !loading ? <p>Product not found. <Link href="/products" className="text-blue-600">Back</Link></p> : <p>Loading...</p>}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Edit product</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Handle</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={handle} onChange={(e) => setHandle(e.target.value)} />
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
          <h3 className="font-medium mb-2">Variants</h3>
          {variants.map((v, i) => (
            <div key={v.id} className="flex gap-4 items-center mb-2 p-2 bg-gray-50 rounded">
              <input
                className="flex-1 border rounded px-2 py-1 text-sm"
                placeholder="SKU"
                value={v.sku}
                onChange={(e) => updateVariant(i, { sku: e.target.value })}
              />
              <input
                className="w-24 border rounded px-2 py-1 text-sm"
                placeholder="Price"
                value={v.price}
                onChange={(e) => updateVariant(i, { price: e.target.value })}
              />
              <input
                type="number"
                className="w-20 border rounded px-2 py-1 text-sm"
                value={v.inventory_quantity}
                onChange={(e) => updateVariant(i, { inventory_quantity: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
          ))}
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link href="/products" className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
