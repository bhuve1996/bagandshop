import { fetchPage } from '@/lib/api';
import { SectionRenderer } from '@/components/SectionRenderer';
import { notFound } from 'next/navigation';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ preview?: string; page_id?: string }>;
}

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const slug = resolvedParams.slug && resolvedParams.slug.length > 0
    ? `/${resolvedParams.slug.join('/')}`
    : '/';

  const preview = resolvedSearch.preview === '1' || resolvedSearch.preview === 'true';
  const data = await fetchPage(slug, undefined, undefined, preview);

  if (!data?.page) {
    notFound();
  }

  const { page, sections } = data;

  return (
    <main>
      <SectionRenderer sections={sections} />
    </main>
  );
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const slug = resolvedParams.slug && resolvedParams.slug.length > 0
    ? `/${resolvedParams.slug.join('/')}`
    : '/';
  const preview = resolvedSearch.preview === '1' || resolvedSearch.preview === 'true';
  const data = await fetchPage(slug, undefined, undefined, preview);
  const meta = data?.page?.meta as { title?: string; description?: string } | undefined;
  return {
    title: meta?.title ?? data?.page?.title ?? (slug === '/' ? 'Bag and Shop' : undefined),
    description: meta?.description,
  };
}
