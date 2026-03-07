import Link from 'next/link';
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
    <main className="section-pad">
      <div className="container-narrow max-w-3xl">
        <nav className="text-sm text-[rgb(var(--color-muted))] mb-6">
          <Link href="/combos" className="hover:text-[rgb(var(--color-foreground))]">Combos</Link>
          <span className="mx-2">/</span>
          <span className="text-[rgb(var(--color-foreground))]">{combo.title}</span>
        </nav>
        <h1 className="heading-1 text-[rgb(var(--color-foreground))]">
          {combo.title}
        </h1>
        {combo.description && (
          <p className="mt-4 prose-custom">{combo.description}</p>
        )}
        <div className="mt-6 flex flex-wrap items-baseline gap-4">
          {combo.pricing_type === 'fixed' && (
            <span className="text-2xl font-semibold text-[rgb(var(--color-foreground))]">${combo.combo_price_or_percent}</span>
          )}
          {combo.pricing_type === 'percentage' && (
            <span className="text-2xl font-semibold text-[rgb(var(--color-accent))]">{combo.combo_price_or_percent}% off</span>
          )}
          <span className="text-sm text-[rgb(var(--color-muted))]">
            {available > 0 ? `${available} in stock` : 'Out of stock'}
          </span>
        </div>

        <div className="mt-10 pt-10 border-t border-[rgb(var(--color-border))]">
          <h2 className="heading-3 text-[rgb(var(--color-foreground))] mb-4">Includes</h2>
          <ul className="space-y-3">
            {combo.items?.map((item) => (
              <li key={item.id} className="flex justify-between items-center py-2 border-b border-[rgb(var(--color-border))] last:border-0">
                <span className="font-medium">{item.product?.title ?? `Product`}{item.quantity > 1 ? ` × ${item.quantity}` : ''}</span>
                {item.fixed_price && (
                  <span className="text-[rgb(var(--color-muted))]">${item.fixed_price}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {available > 0 && (
          <div className="mt-10">
            <AddToCartCombo
              comboId={combo.id}
              price={combo.pricing_type === 'fixed' ? combo.combo_price_or_percent : '0'}
              title={combo.title}
            />
          </div>
        )}
      </div>
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
