'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function NewVendor() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [apiType, setApiType] = useState('rest');
  const [priority, setPriority] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const vendor = await api.vendors.create({
        name: name || 'Unnamed',
        code: code || name?.toLowerCase().replace(/\s+/g, '-') || 'vendor',
        api_type: apiType,
        priority,
        is_active: isActive,
      });
      router.push(`/vendors/${vendor.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">New vendor</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!code) setCode(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
            }}
            placeholder="Vendor name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={code} onChange={(e) => setCode(e.target.value)} placeholder="vendor-code" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API type</label>
          <select className="w-full border rounded px-3 py-2" value={apiType} onChange={(e) => setApiType(e.target.value)}>
            <option value="rest">REST</option>
            <option value="webhook">Webhook</option>
            <option value="feed">Feed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={priority} onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          <label htmlFor="active">Active</label>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Creating...' : 'Create'}
          </button>
          <Link href="/vendors" className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
