'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function NewDiscountPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('0');
  const [usageLimit, setUsageLimit] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.discounts.create({
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
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">New discount code</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={code} onChange={(e) => setCode(e.target.value)} required placeholder="SAVE10" />
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
            <input type="text" className="w-full border rounded px-3 py-2" value={value} onChange={(e) => setValue(e.target.value)} required placeholder={type === 'percent' ? '10' : '5.00'} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min order ($)</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Usage limit (optional)</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} min="1" placeholder="Unlimited" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid from (optional)</label>
            <input type="datetime-local" className="w-full border rounded px-3 py-2" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid until (optional)</label>
            <input type="datetime-local" className="w-full border rounded px-3 py-2" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Creating...' : 'Create'}
          </button>
          <Link href="/discounts" className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
