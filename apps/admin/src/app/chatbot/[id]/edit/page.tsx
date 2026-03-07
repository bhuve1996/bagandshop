'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, type ChatbotKnowledgeRecord } from '@/lib/api';

export default function EditChatbotPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [row, setRow] = useState<ChatbotKnowledgeRecord | null>(null);
  const [patternsText, setPatternsText] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.chatbot.get(id).then((r) => {
      setRow(r);
      setPatternsText(Array.isArray(r.question_patterns) ? r.question_patterns.join('\n') : '');
      setAnswer(r.answer);
      setCategory(r.category ?? '');
      setIsActive(r.is_active);
      setSortOrder(r.sort_order);
    }).catch(() => setRow(null)).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setSaving(true);
    try {
      const question_patterns = patternsText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
      await api.chatbot.update(id, { question_patterns, answer: answer.trim(), category: category.trim() || null, is_active: isActive, sort_order: sortOrder });
      router.push('/chatbot');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !row) {
    return <div className="p-8">{!row && !loading ? <p>Not found. <Link href="/chatbot" className="text-blue-600">Back</Link></p> : <p>Loading...</p>}</div>;
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Edit chatbot entry</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Question patterns</label>
          <textarea className="w-full border rounded px-3 py-2 h-24" value={patternsText} onChange={(e) => setPatternsText(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
          <textarea className="w-full border rounded px-3 py-2 h-24" value={answer} onChange={(e) => setAnswer(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort order</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)} />
          </div>
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
          <Link href="/chatbot" className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
