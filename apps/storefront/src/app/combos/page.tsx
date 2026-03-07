import Link from 'next/link';
import { fetchCombos, fetchSiteConfig } from '@/lib/api';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function CombosListPage() {
  const [combos, config] = await Promise.all([fetchCombos('active'), fetchSiteConfig()]);
  const title = config['combos.title'] ?? 'Combos';
  const emptyCopy = config['combos.empty'] ?? 'No combos available.';

  return (
    <main className="section-pad">
      <div className="container-narrow">
        <h1 className="heading-1 text-[rgb(var(--color-foreground))] mb-10 md:mb-14 text-center">
          {title}
        </h1>
        {combos.length === 0 ? (
          <p className="text-center text-[rgb(var(--color-muted))] py-16">{emptyCopy}</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {combos.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/combos/${c.handle}`}
                  className="card block p-6 md:p-8 h-full group"
                >
                  <h2 className="heading-3 text-[rgb(var(--color-foreground))] group-hover:text-[rgb(var(--color-accent))] transition-colors">
                    {c.title}
                  </h2>
                  {c.pricing_type === 'fixed' && (
                    <p className="mt-2 text-xl font-semibold text-[rgb(var(--color-foreground))]">${c.combo_price_or_percent}</p>
                  )}
                  {c.pricing_type === 'percentage' && (
                    <p className="mt-2 text-xl font-semibold text-[rgb(var(--color-accent))]">{c.combo_price_or_percent}% off</p>
                  )}
                  {c.items?.length ? (
                    <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">{c.items.length} items</p>
                  ) : null}
                  <span className="mt-4 inline-block text-sm font-semibold text-[rgb(var(--color-accent))] group-hover:underline">
                    View bundle →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
