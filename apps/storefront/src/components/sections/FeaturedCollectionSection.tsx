'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCategoryBySlug, fetchProducts } from '@/lib/api';
import type { ProductRecord } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';

interface FeaturedCollectionSettings {
  collection_handle?: string;
  title?: string;
  style?: 'grid' | 'carousel';
}

export function FeaturedCollectionSection({ settings }: { settings: FeaturedCollectionSettings }) {
  const { title = 'Featured', collection_handle = 'all', style = 'grid' } = settings;
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        let categoryId: string | null = null;
        if (collection_handle && collection_handle !== 'all') {
          const cat = await fetchCategoryBySlug(collection_handle);
          if (cat) categoryId = cat.id;
        }
        const list = await fetchProducts(categoryId, 'active');
        if (!cancelled) setProducts(list.slice(0, 4));
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [collection_handle]);

  return (
    <section className="section-pad bg-white">
      <div className="container-narrow">
        <div className="flex items-end justify-between gap-4 mb-10">
          <h2 className="heading-2 text-[rgb(var(--color-foreground))]">{title}</h2>
          <Link href="/collections" className="text-sm font-semibold text-[rgb(var(--color-accent))] hover:underline shrink-0">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-square bg-[rgb(var(--color-card-hover))]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[rgb(var(--color-card-hover))] rounded w-3/4" />
                  <div className="h-5 bg-[rgb(var(--color-card-hover))] rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-[rgb(var(--color-muted))] py-12">No products yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 2} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
