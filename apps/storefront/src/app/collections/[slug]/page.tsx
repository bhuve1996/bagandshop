import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchCategoryBySlug, fetchProducts } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) notFound();

  const products = await fetchProducts(category.id, 'active');

  return (
    <main className="section-pad">
      <div className="container-narrow">
        <nav className="text-sm text-[rgb(var(--color-muted))] mb-6">
          <Link href="/collections" className="hover:text-[rgb(var(--color-foreground))]">Collections</Link>
          <span className="mx-2">/</span>
          <span className="text-[rgb(var(--color-foreground))]">{category.name}</span>
        </nav>
        <h1 className="heading-1 text-[rgb(var(--color-foreground))] mb-10 md:mb-14">
          {category.name}
        </h1>
        {products.length === 0 ? (
          <p className="text-center text-[rgb(var(--color-muted))] py-16">No products in this collection.</p>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
