'use client';

import { useEffect, useState } from 'react';
import { fetchProductReviews, submitReview, type ReviewRecord } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProductReviews(productId).then(setReviews).finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const newReview = await submitReview(productId, rating, title.trim() || null, body.trim() || null, user?.id ?? null);
      setReviews((prev) => [newReview, ...prev]);
      setTitle('');
      setBody('');
      setRating(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>
      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : (
        <ul className="space-y-4 mb-8">
          {reviews.length === 0 ? (
            <li className="text-gray-500">No reviews yet. Be the first!</li>
          ) : (
            reviews.map((r) => (
              <li key={r.id} className="border-l-2 border-gray-200 pl-4">
                <p className="text-amber-600 font-medium">★ {r.rating} {r.status !== 'approved' && <span className="text-gray-400 text-xs">(Pending approval)</span>}</p>
                {r.title && <p className="font-medium">{r.title}</p>}
                {r.body && <p className="text-gray-600 text-sm mt-1">{r.body}</p>}
                <p className="text-gray-400 text-xs mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
              </li>
            ))
          )}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <h3 className="font-semibold">Write a review</h3>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Rating</label>
          <select className="border rounded px-3 py-2" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Title (optional)</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Review (optional)</label>
          <textarea className="w-full border rounded px-3 py-2 h-24" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit review'}
        </button>
      </form>
    </div>
  );
}
