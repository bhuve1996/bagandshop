'use client';

import { useEffect, useState } from 'react';
import { api, type ReviewRecord } from '@/lib/api';

export default function ReviewsPage() {
  const [list, setList] = useState<ReviewRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.reviews.list(statusFilter || undefined).then(setList).finally(() => setLoading(false));
  }, [statusFilter]);

  const handleStatus = async (id: string, status: string) => {
    await api.reviews.updateStatus(id, status);
    setList((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>
      <div className="mb-4">
        <label className="mr-2">Status:</label>
        <select className="border rounded px-3 py-1" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="divide-y bg-white rounded-lg shadow">
          {list.map((r) => (
            <li key={r.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{r.product?.title ?? r.product_id}</p>
                  <p className="text-amber-600">★ {r.rating}</p>
                  {r.title && <p className="font-medium">{r.title}</p>}
                  {r.body && <p className="text-gray-600 text-sm mt-1">{r.body}</p>}
                  <p className="text-gray-400 text-xs mt-2">{new Date(r.created_at).toLocaleString()} · {r.status}</p>
                </div>
                <div className="flex gap-2">
                  {r.status === 'pending' && (
                    <>
                      <button type="button" onClick={() => handleStatus(r.id, 'approved')} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Approve</button>
                      <button type="button" onClick={() => handleStatus(r.id, 'rejected')} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Reject</button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
          {list.length === 0 && <li className="p-6 text-gray-500">No reviews.</li>}
        </ul>
      )}
    </div>
  );
}
