'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type SocialFeedConfigRecord } from '@/lib/api';

export default function SocialPage() {
  const [list, setList] = useState<SocialFeedConfigRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.social.list().then(setList).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this feed config?')) return;
    await api.social.delete(id);
    setList((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Social feed config</h1>
        <Link href="/social/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          New feed
        </Link>
      </div>
      <p className="text-sm text-gray-500 mb-4">Configure Instagram, Twitter, YouTube, TikTok or other feeds. Config is passed to the storefront widget.</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="divide-y bg-white rounded-lg shadow">
          {list.map((r) => (
            <li key={r.id} className="p-6 flex justify-between items-center">
              <div>
                <span className="font-medium capitalize">{r.platform}</span>
                {!r.is_active && <span className="ml-2 text-amber-600 text-sm">(inactive)</span>}
                <pre className="text-xs text-gray-500 mt-1">{JSON.stringify(r.config)}</pre>
              </div>
              <div className="flex gap-2">
                <Link href={`/social/${r.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                <button type="button" onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </li>
          ))}
          {list.length === 0 && <li className="p-6 text-gray-500">No feed configs. Add one for the storefront social section.</li>}
        </ul>
      )}
    </div>
  );
}
