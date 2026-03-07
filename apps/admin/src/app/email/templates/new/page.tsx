'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function NewEmailTemplatePage() {
  const router = useRouter();
  const [key, setKey] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.email.templates.create({ key: key.trim(), subject: subject.trim(), body_html: bodyHtml });
      router.push('/email/templates');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">New email template</h1>
      <p className="text-sm text-gray-500 mb-4">Use variables like {`{{ order_number }}`}, {`{{ email }}`}, {`{{ total }}`}, {`{{ subtotal }}`}, {`{{ discount }}`} in subject and body.</p>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={key} onChange={(e) => setKey(e.target.value)} required placeholder="order_confirmation" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Order {{ order_number }} confirmed" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body (HTML)</label>
          <textarea className="w-full border rounded px-3 py-2 h-48" value={bodyHtml} onChange={(e) => setBodyHtml(e.target.value)} placeholder="<p>Thanks! Your order {{ order_number }} total is ${{ total }}.</p>" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Creating...' : 'Create'}
          </button>
          <Link href="/email/templates" className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
