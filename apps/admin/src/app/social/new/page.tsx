'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

const PLATFORMS = ['instagram', 'twitter', 'youtube', 'tiktok'];

export default function NewSocialPage() {
  const router = useRouter();
  const [platform, setPlatform] = useState('instagram');
  const [configJson, setConfigJson] = useState('{}');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let config: Record<string, unknown> = {};
    try {
      config = JSON.parse(configJson || '{}');
    } catch {
      setError('Invalid JSON in config');
      return;
    }
    setSaving(true);
    try {
      await api.social.create({ platform, config, is_active: isActive });
      router.push('/social');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">New social feed</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
          <select className="w-full border rounded px-3 py-2" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Config (JSON)</label>
          <textarea className="w-full border rounded px-3 py-2 h-24 font-mono text-sm" value={configJson} onChange={(e) => setConfigJson(e.target.value)} placeholder='{"username": "..."}' />
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
          <Link href="/social" className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
