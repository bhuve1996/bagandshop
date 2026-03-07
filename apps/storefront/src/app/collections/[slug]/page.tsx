import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchCategoryBySlug, fetchProducts } from '@/lib/api';

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
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <li key={p.id}>
            <Link
              href={`/products/${p.handle}`}
              className="block border rounded-lg overflow-hidden hover:shadow transition"
            >
              {p.media?.[0] ? (
                <div
                  className="aspect-square bg-gray-100 bg-cover bg-center"
                  style={{ backgroundImage: `url(${p.media[0].url})` }}
                />
              ) : (
                <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
              <div className="p-4">
                <span className="font-medium">{p.title}</span>
                {p.variants?.[0] && (
                  <p className="text-sm text-gray-600 mt-1">${p.variants[0].price}</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {products.length === 0 && (
        <p className="text-gray-500">No products in this collection.</p>
      )}
    </main>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: (category.meta as { description?: string })?.description,
  };
}
