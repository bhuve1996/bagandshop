import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchOrderByNumber } from '@/lib/api';
import { PurchaseTracker } from '@/components/PurchaseTracker';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ email?: string }>;
}

export default async function OrderTrackingPage({ params, searchParams }: Props) {
  const { orderNumber } = await params;
  const { email } = await searchParams;
  const order = await fetchOrderByNumber(orderNumber, email ?? undefined);

  if (!order) notFound();

  const totals = order.totals as Record<string, string>;
  const totalValue = totals?.total;

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <PurchaseTracker orderNumber={order.order_number} value={totalValue} />
      <h1 className="text-2xl font-bold mb-2">Order {order.order_number}</h1>
      <p className="text-gray-500 text-sm mb-8">Placed on {new Date(order.created_at).toLocaleDateString()}</p>

      <div className="mb-8">
        <p className="text-sm font-medium text-gray-700">Status</p>
        <p className="capitalize">{order.status}</p>
        <p className="text-sm font-medium text-gray-700 mt-2">Fulfillment</p>
        <p className="capitalize">{order.fulfillment_status}</p>
      </div>

      <div className="border-t pt-6 mb-8">
        <h2 className="font-semibold mb-4">Items</h2>
        <ul className="divide-y">
          {order.lines?.map((line) => (
            <li key={line.id} className="py-2 flex justify-between">
              <span>Qty {line.quantity}</span>
              <span>${(parseFloat(line.price) * line.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        {totals?.total && (
          <p className="font-semibold mt-4">Total: ${totals.total}</p>
        )}
      </div>

      <div className="border-t pt-6">
        <h2 className="font-semibold mb-2">Shipping address</h2>
        <pre className="text-sm text-gray-600 whitespace-pre-wrap">
          {JSON.stringify(order.shipping_address, null, 2)}
        </pre>
      </div>

      <Link href="/" className="inline-block mt-8 text-blue-600 hover:underline">Continue shopping</Link>
    </main>
  );
}
