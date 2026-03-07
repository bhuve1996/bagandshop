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
    <main className="section-pad">
      <div className="container-narrow max-w-2xl">
        <PurchaseTracker orderNumber={order.order_number} value={totalValue} />
        <h1 className="heading-2 text-[rgb(var(--color-foreground))] mb-2">Order {order.order_number}</h1>
        <p className="prose-custom text-sm mb-8">Placed on {new Date(order.created_at).toLocaleDateString()}</p>

        <div className="grid sm:grid-cols-2 gap-6 mb-8 p-4 rounded-lg bg-[rgb(var(--color-card))]">
          <div>
            <p className="text-sm font-medium text-[rgb(var(--color-muted))]">Status</p>
            <p className="capitalize font-medium text-[rgb(var(--color-foreground))]">{order.status}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-[rgb(var(--color-muted))]">Fulfillment</p>
            <p className="capitalize font-medium text-[rgb(var(--color-foreground))]">{order.fulfillment_status}</p>
          </div>
        </div>

        <div className="border-t border-[rgb(var(--color-border))] pt-6 mb-8">
          <h2 className="heading-3 text-[rgb(var(--color-foreground))] mb-4">Items</h2>
          <ul className="divide-y divide-[rgb(var(--color-border))]">
            {order.lines?.map((line) => (
              <li key={line.id} className="py-3 flex justify-between text-[rgb(var(--color-foreground))]">
                <span>Qty {line.quantity}</span>
                <span>${(parseFloat(line.price) * line.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          {totals?.total && (
            <p className="font-semibold text-[rgb(var(--color-foreground))] mt-4">Total: ${totals.total}</p>
          )}
        </div>

        <div className="border-t border-[rgb(var(--color-border))] pt-6 mb-8">
          <h2 className="heading-3 text-[rgb(var(--color-foreground))] mb-2">Shipping address</h2>
          <pre className="text-sm prose-custom whitespace-pre-wrap">
            {JSON.stringify(order.shipping_address, null, 2)}
          </pre>
        </div>

        <Link href="/" className="btn-outline">Continue shopping</Link>
      </div>
    </main>
  );
}
