'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, type EmailWorkflowRecord, type EmailTemplateRecord } from '@/lib/api';

const TRIGGERS = ['placed', 'shipped', 'delivered', 'cancelled'];

export default function EditEmailWorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [row, setRow] = useState<EmailWorkflowRecord | null>(null);
  const [templates, setTemplates] = useState<EmailTemplateRecord[]>([]);
  const [trigger, setTrigger] = useState('placed');
  const [templateId, setTemplateId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.email.templates.list().then(setTemplates);
  }, []);

  useEffect(() => {
    if (!id) return;
    api.email.workflows.get(id).then((w) => {
      setRow(w);
      setTrigger(w.trigger);
      setTemplateId(w.template_id);
      setIsActive(w.is_active);
    }).catch(() => setRow(null)).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setSaving(true);
    try {
      await api.email.workflows.update(id, { trigger, template_id: templateId, is_active: isActive });
      router.push('/email/workflows');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !row) {
    return <div className="p-8">{!row && !loading ? <p>Not found. <Link href="/email/workflows" className="text-blue-600">Back</Link></p> : <p>Loading...</p>}</div>;
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Edit email workflow</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
          <select className="w-full border rounded px-3 py-2" value={trigger} onChange={(e) => setTrigger(e.target.value)}>
            {TRIGGERS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
          <select className="w-full border rounded px-3 py-2" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>{t.key} — {t.subject}</option>
            ))}
          </select>
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
          <Link href="/email/workflows" className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
