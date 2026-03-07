'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api, type OrderRecord, type VendorRecord } from '@/lib/api';

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');
  const [fulfillmentStatus, setFulfillmentStatus] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([api.orders.get(id), api.vendors.list()]).then(([o, v]) => {
      setOrder(o);
      setStatus(o.status);
      setFulfillmentStatus(o.fulfillment_status);
      setVendors(v);
    }).catch(() => setOrder(null)).finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setUpdating(true);
    try {
      const updated = await api.orders.updateStatus(id, status, fulfillmentStatus);
      setOrder(updated);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="p-8">
        {!order && !loading ? <p>Order not found. <Link href="/orders" className="text-blue-600">Back</Link></p> : <p>Loading...</p>}
      </div>
    );
  }

  const totals = order.totals as Record<string, string>;
  const vendorName = (vendorId: string | null) =>
    vendorId ? (vendors.find((v) => v.id === vendorId)?.name ?? vendorId) : '—';
  const events = (order.events ?? []).slice().sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Order {order.order_number}</h1>
      <p className="text-gray-500 text-sm mb-6">{order.email ?? 'No email'} · {new Date(order.created_at).toLocaleString()}</p>
      {order.vendor_id && (
        <p className="text-sm mb-4">Assigned vendor: <strong>{vendorName(order.vendor_id)}</strong></p>
      )}

      <form onSubmit={handleUpdateStatus} className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="font-semibold mb-4">Update status</h2>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select className="border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Fulfillment</label>
            <select className="border rounded px-3 py-2" value={fulfillmentStatus} onChange={(e) => setFulfillmentStatus(e.target.value)}>
              <option value="unfulfilled">Unfulfilled</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="shipped">Shipped</option>
            </select>
          </div>
        </div>
        <button type="submit" disabled={updating} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {updating ? 'Saving...' : 'Save'}
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="font-semibold mb-4">Items</h2>
        <ul className="divide-y">
          {order.lines?.map((line) => (
            <li key={line.id} className="py-2 flex justify-between items-start gap-4">
              <span>Product {line.product_id ?? '—'} / Variant {line.variant_id ?? '—'} / Combo {line.combo_id ?? '—'} × {line.quantity}</span>
              <span className="flex flex-col items-end">
                <span>${(parseFloat(line.price) * line.quantity).toFixed(2)}</span>
                {(line.vendor_id != null || line.vendor_order_ref) && (
                  <span className="text-gray-500 text-xs">Vendor: {vendorName(line.vendor_id)} {line.vendor_order_ref && ` · Ref: ${line.vendor_order_ref}`}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
        {totals?.total && <p className="font-semibold mt-4">Total: ${totals.total}</p>}
      </div>

      {events.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="font-semibold mb-4">Order events</h2>
          <ul className="space-y-2">
            {events.map((ev) => (
              <li key={ev.id} className="flex gap-3 text-sm">
                <span className="text-gray-500 shrink-0">{new Date(ev.created_at).toLocaleString()}</span>
                <span className="font-medium">{ev.type}</span>
                <span className="text-gray-500">({ev.source})</span>
                {Object.keys(ev.payload ?? {}).length > 0 && (
                  <pre className="text-xs text-gray-400 truncate max-w-xs">{JSON.stringify(ev.payload)}</pre>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Shipping address</h2>
        <pre className="text-sm text-gray-600 whitespace-pre-wrap">{JSON.stringify(order.shipping_address, null, 2)}</pre>
      </div>

      <Link href="/orders" className="inline-block mt-6 text-blue-600 hover:underline">Back to orders</Link>
    </div>
  );
}
