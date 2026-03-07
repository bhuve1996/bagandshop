import type { MetadataRoute } from 'next';
import { fetchCategories, fetchProducts, fetchCombos } from '@/lib/api';

const BASE = process.env.NEXT_PUBLIC_STOREFRONT_URL ?? 'http://localhost:3000';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let categories: Awaited<ReturnType<typeof fetchCategories>> = [];
  let products: Awaited<ReturnType<typeof fetchProducts>> = [];
  let combos: Awaited<ReturnType<typeof fetchCombos>> = [];
  try {
    [categories, products, combos] = await Promise.all([
      fetchCategories(),
      fetchProducts(undefined, 'active'),
      fetchCombos('active'),
    ]);
  } catch {
    // API unavailable at build or runtime; return static entries only
  }

  const entries: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/collections`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/combos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/cart`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  for (const c of categories) {
    if (c.slug) {
      entries.push({
        url: `${BASE}/collections/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  for (const p of products) {
    entries.push({
      url: `${BASE}/products/${p.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  for (const c of combos) {
    entries.push({
      url: `${BASE}/combos/${c.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  return entries;
}
