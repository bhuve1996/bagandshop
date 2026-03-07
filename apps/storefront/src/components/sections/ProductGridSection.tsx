'use client';

import { useEffect, useState } from 'react';
import { fetchCategoryBySlug, fetchProducts } from '@/lib/api';
import type { ProductRecord } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';

interface ProductGridSettings {
  title?: string;
  collection_handle?: string;
  columns?: number;
  limit?: number;
}

export function ProductGridSection({ settings }: { settings: ProductGridSettings }) {
  const { title = 'Featured products', collection_handle = 'all', columns = 4, limit = 8 } = settings;
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
        if (!cancelled) setProducts(list.slice(0, Math.min(limit, 12)));
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [collection_handle, limit]);

  const gridCols = columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <section className="section-pad bg-white">
      <div className="container-narrow">
        {title && (
          <h2 className="heading-2 text-[rgb(var(--color-foreground))] mb-10 text-center">
            {title}
          </h2>
        )}
        {loading ? (
          <div className={`grid ${gridCols} gap-6 md:gap-8`}>
            {Array.from({ length: Math.min(limit, 4) }).map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-square bg-[rgb(var(--color-card-hover))]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[rgb(var(--color-card-hover))] rounded w-3/4" />
                  <div className="h-5 bg-[rgb(var(--color-card-hover))] rounded w-1/4" />
                  <div className="h-10 bg-[rgb(var(--color-card-hover))] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-[rgb(var(--color-muted))] py-12">No products yet.</p>
        ) : (
          <div className={`grid ${gridCols} gap-6 md:gap-8`}>
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
