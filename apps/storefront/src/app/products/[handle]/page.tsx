import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DEFAULT_SITE_COPY } from '@bagandshop/shared';
import { fetchProductByHandle, fetchSiteConfig } from '@/lib/api';
import { AddToCartProduct } from '@/components/AddToCartButton';
import { ProductReviews } from '@/components/ProductReviews';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ handle: string }>;
}

function ProductJsonLd({ product }: { product: { handle: string; title: string; description: string | null; media?: Array<{ url: string }>; variants?: Array<{ price: string }> } }) {
  const BASE = process.env.NEXT_PUBLIC_STOREFRONT_URL ?? 'http://localhost:3000';
  const price = product.variants?.[0]?.price;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description ?? product.title,
    ...(product.media?.[0] && { image: product.media[0].url }),
    ...(price && {
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    }),
    url: `${BASE}/products/${product.handle}`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const [product, config] = await Promise.all([
    fetchProductByHandle(handle),
    fetchSiteConfig(),
  ]);
  if (!product) notFound();

  const defaultVariant = product.variants?.[0];
  const copy = (key: string) => config[key] ?? DEFAULT_SITE_COPY[key] ?? key;

  return (
    <main className="section-pad">
      <ProductJsonLd product={product} />
      <div className="container-narrow">
        <nav className="text-sm text-[rgb(var(--color-muted))] mb-6">
          <Link href="/collections" className="hover:text-[rgb(var(--color-foreground))]">Collections</Link>
          <span className="mx-2">/</span>
          <span className="text-[rgb(var(--color-foreground))]">{product.title}</span>
        </nav>
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <div className="aspect-square rounded-[var(--radius-xl)] overflow-hidden bg-[rgb(var(--color-card))] shadow-soft">
            {product.media?.[0] ? (
              <img
                src={product.media[0].url}
                alt={product.media[0].alt ?? product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[rgb(var(--color-muted-foreground))]">
                No image
              </div>
            )}
          </div>
          <div className="md:sticky md:top-24 md:self-start">
            <h1 className="heading-2 text-[rgb(var(--color-foreground))]">
              {product.title}
            </h1>
            {defaultVariant && (
              <p className="mt-3 text-2xl font-semibold text-[rgb(var(--color-foreground))]">
                ${defaultVariant.price}
                {product.variants && product.variants.length > 1 && (
                  <span className="ml-2 text-base font-normal text-[rgb(var(--color-muted))]">from</span>
                )}
              </p>
            )}
            {product.description && (
              <div className="mt-6 prose-custom">
                <p>{product.description}</p>
              </div>
            )}
            {product.variants && product.variants.length > 1 && (
              <div className="mt-6 p-4 rounded-lg bg-[rgb(var(--color-card))]">
                <p className="text-sm font-semibold text-[rgb(var(--color-foreground))] mb-2">{copy('product.variants')}</p>
                <ul className="space-y-2">
                  {product.variants.map((v) => (
                    <li key={v.id} className="flex justify-between text-sm">
                      <span>{v.title || v.sku}</span>
                      <span>${v.price} {v.inventory_quantity > 0 ? `(${v.inventory_quantity} ${copy('product.inStock')})` : `(${copy('product.outOfStock')})`}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {defaultVariant && defaultVariant.inventory_quantity > 0 && (
              <div className="mt-8">
                <AddToCartProduct
                  productId={product.id}
                  variantId={defaultVariant.id}
                  price={defaultVariant.price}
                  title={product.title}
                />
              </div>
            )}
            <div className="mt-8 pt-8 border-t border-[rgb(var(--color-border))] text-sm text-[rgb(var(--color-muted))]">
              Free shipping on orders over $50 · Easy 30-day returns
            </div>
            {product.faqs && product.faqs.length > 0 && (
              <div className="mt-12 border-t border-[rgb(var(--color-border))] pt-8">
                <h2 className="heading-3 text-[rgb(var(--color-foreground))] mb-4">{copy('product.faq')}</h2>
                <ul className="space-y-4">
                  {product.faqs.map((faq) => (
                    <li key={faq.id}>
                      <p className="font-medium text-[rgb(var(--color-foreground))]">{faq.question}</p>
                      <p className="prose-custom text-sm mt-1">{faq.answer}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <ProductReviews productId={product.id} />
          </div>
        </div>
      </div>
    </main>
  );
}

const BASE = process.env.NEXT_PUBLIC_STOREFRONT_URL ?? 'http://localhost:3000';

export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  const product = await fetchProductByHandle(handle);
  if (!product) return {};
  const meta = product.meta as { title?: string; description?: string };
  const title = meta?.title ?? product.title;
  const description = meta?.description ?? product.description ?? undefined;
  const image = product.media?.[0]?.url;
  const url = `${BASE}/products/${product.handle}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? undefined,
      url,
      type: 'website',
      ...(image && { images: [{ url: image, alt: product.media?.[0]?.alt ?? product.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description ?? undefined,
    },
    alternates: { canonical: url },
  };
}
