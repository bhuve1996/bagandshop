'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type VendorRecord } from '@/lib/api';

export default function VendorsList() {
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.vendors.list().then(setVendors).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendors</h1>
        <Link href="/vendors/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          New vendor
        </Link>
      </div>
      <ul className="bg-white rounded-lg shadow divide-y">
        {vendors.map((v) => (
          <li key={v.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <span className="font-medium">{v.name}</span>
              <span className="text-gray-500 ml-2">({v.code})</span>
              <span className="text-sm text-gray-400 ml-2">{v.api_type}</span>
              {!v.is_active && <span className="text-sm text-amber-600 ml-2">Inactive</span>}
            </div>
            <Link href={`/vendors/${v.id}/edit`} className="text-blue-600 hover:underline">
              Edit
            </Link>
          </li>
        ))}
      </ul>
      {!loading && vendors.length === 0 && (
        <p className="text-gray-500 mt-4">No vendors yet.</p>
      )}
    </div>
  );
}
