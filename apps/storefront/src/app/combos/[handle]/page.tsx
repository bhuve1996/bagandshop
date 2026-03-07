import { notFound } from 'next/navigation';
import { fetchComboByHandle, fetchComboInventory } from '@/lib/api';
import { AddToCartCombo } from '@/components/AddToCartButton';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ handle: string }>;
}

export default async function ComboDetailPage({ params }: Props) {
  const { handle } = await params;
  const combo = await fetchComboByHandle(handle);
  if (!combo) notFound();

  const available = await fetchComboInventory(combo.id);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{combo.title}</h1>
        {combo.description && (
          <p className="text-gray-600 mt-2">{combo.description}</p>
        )}
        <div className="mt-4 flex items-baseline gap-4">
          {combo.pricing_type === 'fixed' && (
            <span className="text-xl font-semibold">${combo.combo_price_or_percent}</span>
          )}
          {combo.pricing_type === 'percentage' && (
            <span className="text-xl font-semibold">{combo.combo_price_or_percent}% off</span>
          )}
          <span className="text-sm text-gray-500">
            {available > 0 ? `${available} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>

      <div className="border-t pt-8">
        <h2 className="text-lg font-semibold mb-4">Includes</h2>
        <ul className="space-y-2">
          {combo.items?.map((item) => (
            <li key={item.id} className="flex justify-between items-center">
              <span>
                {item.product?.title ?? `Product ${item.product_id}`}
                {item.quantity > 1 && ` × ${item.quantity}`}
              </span>
              {item.fixed_price && (
                <span className="text-gray-600">${item.fixed_price}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {available > 0 && (
        <div className="mt-8">
          <AddToCartCombo
            comboId={combo.id}
            price={combo.pricing_type === 'fixed' ? combo.combo_price_or_percent : '0'}
            title={combo.title}
          />
        </div>
      )}
    </main>
  );
}

const BASE = process.env.NEXT_PUBLIC_STOREFRONT_URL ?? 'http://localhost:3000';

export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  const combo = await fetchComboByHandle(handle);
  if (!combo) return {};
  const meta = combo.meta as { title?: string; description?: string };
  const title = meta?.title ?? combo.title;
  const description = meta?.description ?? combo.description ?? undefined;
  const url = `${BASE}/combos/${handle}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? undefined,
      url,
      type: 'website',
    },
    twitter: { card: 'summary', title, description: description ?? undefined },
    alternates: { canonical: url },
  };
}
