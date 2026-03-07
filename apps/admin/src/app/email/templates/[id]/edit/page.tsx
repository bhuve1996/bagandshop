'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, type EmailTemplateRecord } from '@/lib/api';

export default function EditEmailTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [row, setRow] = useState<EmailTemplateRecord | null>(null);
  const [key, setKey] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.email.templates.get(id).then((t) => {
      setRow(t);
      setKey(t.key);
      setSubject(t.subject);
      setBodyHtml(t.body_html);
    }).catch(() => setRow(null)).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setSaving(true);
    try {
      await api.email.templates.update(id, { key: key.trim(), subject: subject.trim(), body_html: bodyHtml });
      router.push('/email/templates');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !row) {
    return <div className="p-8">{!row && !loading ? <p>Not found. <Link href="/email/templates" className="text-blue-600">Back</Link></p> : <p>Loading...</p>}</div>;
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit email template</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={key} onChange={(e) => setKey(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body (HTML)</label>
          <textarea className="w-full border rounded px-3 py-2 h-48" value={bodyHtml} onChange={(e) => setBodyHtml(e.target.value)} />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link href="/email/templates" className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
