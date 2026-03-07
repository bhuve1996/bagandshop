import Link from 'next/link';
import { fetchCategories, fetchSiteConfig } from '@/lib/api';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  const [categories, config] = await Promise.all([fetchCategories(null), fetchSiteConfig()]);
  const title = config['collections.title'] ?? 'Collections';
  const emptyCopy = config['collections.empty'] ?? 'No collections yet.';

  return (
    <main className="section-pad">
      <div className="container-narrow">
        <h1 className="heading-1 text-[rgb(var(--color-foreground))] mb-10 md:mb-14 text-center">
          {title}
        </h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/collections/${c.slug}`}
                className="card block overflow-hidden group"
              >
                <div className="aspect-[4/3] bg-[rgb(var(--color-card-hover))] flex items-center justify-center">
                  <span className="text-4xl font-bold text-[rgb(var(--color-muted-foreground))] group-hover:text-[rgb(var(--color-accent))] transition-colors">
                    {c.name.charAt(0)}
                  </span>
                </div>
                <div className="p-5">
                  <span className="font-semibold text-[rgb(var(--color-foreground))] group-hover:text-[rgb(var(--color-accent))] transition-colors">
                    {c.name}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {categories.length === 0 && (
          <p className="text-center text-[rgb(var(--color-muted))] py-16">{emptyCopy}</p>
        )}
      </div>
    </main>
  );
}
