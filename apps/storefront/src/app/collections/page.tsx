import Link from 'next/link';
import { fetchCategories } from '@/lib/api';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  const categories = await fetchCategories(null);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Collections</h1>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              href={`/collections/${c.slug}`}
              className="block p-6 border rounded-lg hover:border-gray-400 hover:shadow transition"
            >
              <span className="font-medium">{c.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      {categories.length === 0 && (
        <p className="text-gray-500">No collections yet.</p>
      )}
    </main>
  );
}
