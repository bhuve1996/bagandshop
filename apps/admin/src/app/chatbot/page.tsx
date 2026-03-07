'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type ChatbotKnowledgeRecord } from '@/lib/api';

export default function ChatbotPage() {
  const [list, setList] = useState<ChatbotKnowledgeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.chatbot.list().then(setList).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    await api.chatbot.delete(id);
    setList((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chatbot knowledge</h1>
        <Link href="/chatbot/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          New entry
        </Link>
      </div>
      <p className="text-sm text-gray-500 mb-4">Question patterns can be plain text (substring match) or regex. First matching active entry wins.</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="divide-y bg-white rounded-lg shadow">
          {list.map((r) => (
            <li key={r.id} className="p-6 flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Patterns: {r.question_patterns.join(', ') || '—'}</p>
                <p className="mt-1">{r.answer}</p>
                {r.category && <span className="text-xs text-gray-400">{r.category}</span>}
                {!r.is_active && <span className="ml-2 text-amber-600 text-sm">(inactive)</span>}
              </div>
              <div className="flex gap-2">
                <Link href={`/chatbot/${r.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                <button type="button" onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </li>
          ))}
          {list.length === 0 && <li className="p-6 text-gray-500">No entries. Add Q&A patterns for the storefront chatbot.</li>}
        </ul>
      )}
    </div>
  );
}
