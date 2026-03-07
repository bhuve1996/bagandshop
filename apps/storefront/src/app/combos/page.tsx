import Link from 'next/link';
import { fetchCombos } from '@/lib/api';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function CombosListPage() {
  const combos = await fetchCombos('active');

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Bundles & Combos</h1>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {combos.map((c) => (
          <li key={c.id}>
            <Link
              href={`/combos/${c.handle}`}
              className="block p-6 border rounded-lg hover:border-gray-400 hover:shadow transition"
            >
              <span className="font-medium">{c.title}</span>
              {c.pricing_type === 'fixed' && (
                <p className="text-sm text-gray-600 mt-1">${c.combo_price_or_percent}</p>
              )}
              {c.pricing_type === 'percentage' && (
                <p className="text-sm text-gray-600 mt-1">{c.combo_price_or_percent}% off</p>
              )}
              {c.items?.length ? (
                <p className="text-xs text-gray-500 mt-1">{c.items.length} items</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
      {combos.length === 0 && (
        <p className="text-gray-500">No combos available.</p>
      )}
    </main>
  );
}
