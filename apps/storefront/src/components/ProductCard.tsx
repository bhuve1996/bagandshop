'use client';

import Link from 'next/link';
import type { ProductRecord } from '@/lib/api';
import { useT } from '@/context/SiteConfigContext';
import { AddToCartProduct } from '@/components/AddToCartButton';

interface ProductCardProps {
  product: ProductRecord;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const t = useT();
  const defaultVariant = product.variants?.[0];
  const inStock = (defaultVariant?.inventory_quantity ?? 0) > 0;
  const imageUrl = product.media?.[0]?.url;

  return (
    <article className="group card overflow-hidden">
      <Link href={`/products/${product.handle}`} className="block aspect-square overflow-hidden bg-[rgb(var(--color-card))]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.media?.[0]?.alt ?? product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading={priority ? 'eager' : 'lazy'}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[rgb(var(--color-muted-foreground))] text-sm">
            {t('section.imagePlaceholder')}
          </div>
        )}
      </Link>
      <div className="p-4 md:p-5">
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-semibold text-[rgb(var(--color-foreground))] line-clamp-2 hover:text-[rgb(var(--color-accent))] transition-colors">
            {product.title}
          </h3>
        </Link>
        {defaultVariant && (
          <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-foreground))]">
            ${defaultVariant.price}
            {product.variants && product.variants.length > 1 && (
              <span className="ml-1 text-sm font-normal text-[rgb(var(--color-muted))]">
                from
              </span>
            )}
          </p>
        )}
        <div className="mt-3">
          {inStock ? (
            <AddToCartProduct
              productId={product.id}
              variantId={defaultVariant!.id}
              price={defaultVariant!.price}
              title={product.title}
            />
          ) : (
            <p className="text-sm text-[rgb(var(--color-muted))]">{t('product.outOfStock')}</p>
          )}
        </div>
      </div>
    </article>
  );
}
