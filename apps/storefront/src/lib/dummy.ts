import data from '@/data/dummy-data.json';
import type { CategoryRecord, ProductRecord, PageResponse, ComboRecord, ComboItemRecord } from '@/lib/api';

const raw = data as unknown as {
  siteConfig: Record<string, string>;
  categories: CategoryRecord[];
  products: ProductRecord[];
  combos: ComboRecord[];
  homePage: PageResponse;
};

export function getDummySiteConfig(): Record<string, string> {
  return { ...raw.siteConfig };
}

export function getDummyCategories(_parentId?: string | null): CategoryRecord[] {
  return [...raw.categories];
}

export function getDummyCategoryBySlug(slug: string): CategoryRecord | null {
  return raw.categories.find((c) => c.slug === slug) ?? null;
}

export function getDummyProducts(categoryId?: string | null, status = 'active'): ProductRecord[] {
  let list = raw.products;
  if (categoryId !== undefined && categoryId !== null) {
    list = list.filter((p) => p.category_id === categoryId);
  }
  return list.filter((p) => p.status === status);
}

export function getDummyProductByHandle(handle: string): ProductRecord | null {
  return raw.products.find((p) => p.handle === handle) ?? null;
}

function hydrateComboItems(combo: ComboRecord): ComboRecord {
  const items: ComboItemRecord[] = (combo.items ?? []).map((item) => {
    const product = raw.products.find((p) => p.id === item.product_id) ?? null;
    const variant = product?.variants?.find((v) => v.id === item.variant_id);
    return {
      ...item,
      product: product ?? undefined,
      variant: variant
        ? {
            id: variant.id,
            sku: variant.sku,
            price: variant.price,
            inventory_quantity: variant.inventory_quantity,
          }
        : undefined,
    };
  });
  return { ...combo, items };
}

export function getDummyCombos(status = 'active'): ComboRecord[] {
  return raw.combos.filter((c) => c.status === status).map(hydrateComboItems);
}

export function getDummyComboByHandle(handle: string): ComboRecord | null {
  const combo = raw.combos.find((c) => c.handle === handle) ?? null;
  return combo ? hydrateComboItems(combo) : null;
}

export function getDummyComboInventory(_comboId: string): number {
  return 10;
}

export function getDummyPage(slug?: string, template?: string): PageResponse | null {
  if (slug === undefined || slug === '/' || slug === '' || template === 'home') return raw.homePage;
  return null;
}
