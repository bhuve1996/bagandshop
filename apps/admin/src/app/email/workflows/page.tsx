'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type EmailWorkflowRecord } from '@/lib/api';

export default function EmailWorkflowsPage() {
  const [list, setList] = useState<EmailWorkflowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.email.workflows.list().then(setList).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email workflows</h1>
        <Link href="/email/workflows/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          New workflow
        </Link>
      </div>
      <p className="text-sm text-gray-500 mb-4">Triggers: placed, shipped, delivered, cancelled (and more). When an order event occurs, matching workflows send the template to the order email.</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="divide-y bg-white rounded-lg shadow">
          {list.map((w) => (
            <li key={w.id} className="flex justify-between items-center px-6 py-4">
              <div>
                <span className="font-medium">{w.trigger}</span>
                <span className="text-gray-500 text-sm ml-2">→ {w.template?.key ?? w.template_id}</span>
                {!w.is_active && <span className="ml-2 text-amber-600 text-sm">(inactive)</span>}
              </div>
              <Link href={`/email/workflows/${w.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
            </li>
          ))}
          {list.length === 0 && <li className="px-6 py-6 text-gray-500">No workflows. Create one to send emails on order_placed, shipped, etc.</li>}
        </ul>
      )}
      <p className="mt-4">
        <Link href="/email/templates" className="text-blue-600 hover:underline">Email templates</Link>
      </p>
    </div>
  );
}
