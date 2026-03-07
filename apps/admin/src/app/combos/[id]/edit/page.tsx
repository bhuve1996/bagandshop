'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api, type ComboRecord, type ProductRecord } from '@/lib/api';

interface ComboItemRow {
  id?: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  fixed_price: string | null;
}

export default function EditCombo() {
  const params = useParams();
  const id = params.id as string;
  const [combo, setCombo] = useState<ComboRecord | null>(null);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [title, setTitle] = useState('');
  const [handle, setHandle] = useState('');
  const [description, setDescription] = useState('');
  const [pricingType, setPricingType] = useState('fixed');
  const [comboPriceOrPercent, setComboPriceOrPercent] = useState('');
  const [status, setStatus] = useState('draft');
  const [items, setItems] = useState<ComboItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.products.list(undefined, undefined).then(setProducts);
  }, []);

  useEffect(() => {
    if (!id) return;
    api.combos.get(id).then((c) => {
      setCombo(c);
      setTitle(c.title);
      setHandle(c.handle);
      setDescription(c.description ?? '');
      setPricingType(c.pricing_type);
      setComboPriceOrPercent(c.combo_price_or_percent);
      setStatus(c.status);
      setItems((c.items ?? []).map((i) => ({
        id: i.id,
        product_id: i.product_id,
        variant_id: i.variant_id,
        quantity: i.quantity,
        fixed_price: i.fixed_price,
      })));
    }).catch(() => setCombo(null)).finally(() => setLoading(false));
  }, [id]);

  const addItem = () => {
    setItems((prev) => [...prev, { product_id: '', variant_id: null, quantity: 1, fixed_price: null }]);
  };

  const updateItem = (index: number, updates: Partial<ComboItemRow>) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    const validItems = items.filter((i) => i.product_id);
    if (!validItems.length) {
      setError('Add at least one product.');
      return;
    }
    setSaving(true);
    try {
      await api.combos.update(id, {
        title,
        handle,
        description: description || null,
        pricing_type: pricingType,
        combo_price_or_percent: comboPriceOrPercent,
        status,
        items: validItems.map((i) => ({
          product_id: i.product_id,
          variant_id: i.variant_id || null,
          quantity: i.quantity,
          fixed_price: i.fixed_price || null,
        })) as unknown as ComboRecord['items'],
      });
      const updated = await api.combos.get(id);
      setCombo(updated);
      setItems((updated.items ?? []).map((i) => ({
        id: i.id,
        product_id: i.product_id,
        variant_id: i.variant_id,
        quantity: i.quantity,
        fixed_price: i.fixed_price,
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const product = (productId: string) => products.find((p) => p.id === productId);

  if (loading || !combo) {
    return (
      <div className="p-8">
        {!combo && !loading ? <p>Combo not found. <Link href="/combos" className="text-blue-600">Back</Link></p> : <p>Loading...</p>}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit combo</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
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
          <textarea className="w-full border rounded px-3 py-2" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pricing type</label>
            <select className="w-full border rounded px-3 py-2" value={pricingType} onChange={(e) => setPricingType(e.target.value)}>
              <option value="fixed">Fixed price</option>
              <option value="percentage">Percentage off</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{pricingType === 'fixed' ? 'Bundle price' : 'Percent off'}</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={comboPriceOrPercent} onChange={(e) => setComboPriceOrPercent(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="w-full border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Items</label>
            <button type="button" onClick={addItem} className="text-sm text-blue-600 hover:underline">+ Add item</button>
          </div>
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 items-center mb-2 p-2 bg-gray-50 rounded">
              <select
                className="flex-1 border rounded px-2 py-1 text-sm"
                value={item.product_id}
                onChange={(e) => updateItem(i, { product_id: e.target.value, variant_id: null })}
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
              <select
                className="w-32 border rounded px-2 py-1 text-sm"
                value={item.variant_id || ''}
                onChange={(e) => updateItem(i, { variant_id: e.target.value || null })}
              >
                <option value="">Any variant</option>
                {product(item.product_id)?.variants?.map((v) => (
                  <option key={v.id} value={v.id}>{v.sku} (${v.price})</option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                className="w-16 border rounded px-2 py-1 text-sm"
                value={item.quantity}
                onChange={(e) => updateItem(i, { quantity: parseInt(e.target.value, 10) || 1 })}
              />
              <input
                type="text"
                className="w-20 border rounded px-2 py-1 text-sm"
                placeholder="Price"
                value={item.fixed_price ?? ''}
                onChange={(e) => updateItem(i, { fixed_price: e.target.value || null })}
              />
              <button type="button" onClick={() => removeItem(i)} className="text-red-600 text-sm">Remove</button>
            </div>
          ))}
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link href="/combos" className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
