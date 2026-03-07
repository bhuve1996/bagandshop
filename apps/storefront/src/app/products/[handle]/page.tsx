import { notFound } from 'next/navigation';
import { fetchProductByHandle } from '@/lib/api';
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
  const product = await fetchProductByHandle(handle);
  if (!product) notFound();

  const defaultVariant = product.variants?.[0];

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <ProductJsonLd product={product} />
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.media?.[0] ? (
            <img
              src={product.media[0].url}
              alt={product.media[0].alt ?? product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          {defaultVariant && (
            <p className="text-xl text-gray-600 mt-2">${defaultVariant.price}</p>
          )}
          {product.description && (
            <div className="mt-6 prose prose-gray max-w-none">
              <p>{product.description}</p>
            </div>
          )}
          {product.variants && product.variants.length > 1 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Variants</p>
              <ul className="space-y-1">
                {product.variants.map((v) => (
                  <li key={v.id} className="flex justify-between text-sm">
                    <span>{v.title || v.sku}</span>
                    <span>${v.price} {v.inventory_quantity > 0 ? `(${v.inventory_quantity} in stock)` : '(out of stock)'}</span>
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
          {product.faqs && product.faqs.length > 0 && (
            <div className="mt-12 border-t pt-8">
              <h2 className="text-xl font-bold mb-4">FAQ</h2>
              <ul className="space-y-4">
                {product.faqs.map((faq) => (
                  <li key={faq.id}>
                    <p className="font-medium">{faq.question}</p>
                    <p className="text-gray-600 text-sm mt-1">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ProductReviews productId={product.id} />
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
