'use client';

import Link from 'next/link';
import { useT } from '@/context/SiteConfigContext';

export default function NotFound() {
  const t = useT();
  return (
    <main className="section-pad flex items-center justify-center min-h-[60vh]">
      <div className="container-narrow max-w-lg text-center">
        <h1 className="heading-1 text-[rgb(var(--color-foreground))] mb-3">{t('notFound.title')}</h1>
        <p className="prose-custom mb-8">{t('notFound.message')}</p>
        <Link href="/" className="btn-primary">
          {t('notFound.backHome')}
        </Link>
      </div>
    </main>
  );
}
