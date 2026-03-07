'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type EmailTemplateRecord } from '@/lib/api';

export default function EmailTemplatesPage() {
  const [list, setList] = useState<EmailTemplateRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.email.templates.list().then(setList).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email templates</h1>
        <Link href="/email/templates/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          New template
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="divide-y bg-white rounded-lg shadow">
          {list.map((t) => (
            <li key={t.id} className="flex justify-between items-center px-6 py-4">
              <div>
                <span className="font-medium">{t.key}</span>
                <span className="text-gray-500 text-sm ml-2">— {t.subject}</span>
              </div>
              <Link href={`/email/templates/${t.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
            </li>
          ))}
          {list.length === 0 && <li className="px-6 py-6 text-gray-500">No templates. Create one for order confirmation, shipped, etc.</li>}
        </ul>
      )}
      <p className="mt-4">
        <Link href="/email/workflows" className="text-blue-600 hover:underline">Email workflows</Link>
      </p>
    </div>
  );
}
