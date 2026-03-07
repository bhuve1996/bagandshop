'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, type SocialFeedConfigRecord } from '@/lib/api';

const PLATFORMS = ['instagram', 'twitter', 'youtube', 'tiktok'];

export default function EditSocialPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [row, setRow] = useState<SocialFeedConfigRecord | null>(null);
  const [platform, setPlatform] = useState('instagram');
  const [configJson, setConfigJson] = useState('{}');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.social.get(id).then((r) => {
      setRow(r);
      setPlatform(r.platform);
      setConfigJson(JSON.stringify(r.config ?? {}, null, 2));
      setIsActive(r.is_active);
    }).catch(() => setRow(null)).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
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
      await api.social.update(id, { platform, config, is_active: isActive });
      router.push('/social');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !row) {
    return <div className="p-8">{!row && !loading ? <p>Not found. <Link href="/social" className="text-blue-600">Back</Link></p> : <p>Loading...</p>}</div>;
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Edit social feed</h1>
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
          <textarea className="w-full border rounded px-3 py-2 h-24 font-mono text-sm" value={configJson} onChange={(e) => setConfigJson(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          <label htmlFor="active">Active</label>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link href="/social" className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
