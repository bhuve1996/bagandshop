'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, type DiscountCodeRecord } from '@/lib/api';

export default function EditDiscountPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [row, setRow] = useState<DiscountCodeRecord | null>(null);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('0');
  const [usageLimit, setUsageLimit] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.discounts.get(id).then((d) => {
      setRow(d);
      setCode(d.code);
      setType(d.type as 'percent' | 'fixed');
      setValue(d.value);
      setMinOrder(d.min_order);
      setUsageLimit(d.usage_limit != null ? String(d.usage_limit) : '');
      setValidFrom(d.valid_from ? d.valid_from.slice(0, 16) : '');
      setValidUntil(d.valid_until ? d.valid_until.slice(0, 16) : '');
    }).catch(() => setRow(null)).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setSaving(true);
    try {
      await api.discounts.update(id, {
        code: code.trim().toUpperCase(),
        type,
        value: value.trim(),
        min_order: minOrder.trim() || '0',
        usage_limit: usageLimit.trim() ? parseInt(usageLimit, 10) : null,
        valid_from: validFrom.trim() || null,
        valid_until: validUntil.trim() || null,
      });
      router.push('/discounts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !row) {
    return <div className="p-8">{!row && !loading ? <p>Not found. <Link href="/discounts" className="text-blue-600">Back</Link></p> : <p>Loading...</p>}</div>;
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Edit discount code</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={code} onChange={(e) => setCode(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select className="w-full border rounded px-3 py-2" value={type} onChange={(e) => setType(e.target.value as 'percent' | 'fixed')}>
              <option value="percent">Percent</option>
              <option value="fixed">Fixed amount</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={value} onChange={(e) => setValue(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min order ($)</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Usage limit (optional)</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} min="1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid from</label>
            <input type="datetime-local" className="w-full border rounded px-3 py-2" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid until</label>
            <input type="datetime-local" className="w-full border rounded px-3 py-2" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
          </div>
        </div>
        <p className="text-sm text-gray-500">Used: {row.used_count} times</p>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link href="/discounts" className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
