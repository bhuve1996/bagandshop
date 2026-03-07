import Link from 'next/link';

interface ImageWithTextSettings {
  image?: string;
  heading?: string;
  body?: string;
  cta_text?: string;
  cta_url?: string;
  side?: 'left' | 'right';
}

export function ImageWithTextSection({ settings }: { settings: ImageWithTextSettings }) {
  const {
    image = '',
    heading = '',
    body = '',
    cta_text = 'Learn more',
    cta_url = '/',
    side = 'left',
  } = settings;

  const textBlock = (
    <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
      {heading && <h2 className="heading-2 text-[rgb(var(--color-foreground))] mb-4">{heading}</h2>}
      {body && <p className="prose-custom mb-6">{body}</p>}
      {cta_url && (
        <Link href={cta_url} className="btn-outline w-fit">
          {cta_text}
        </Link>
      )}
    </div>
  );

  const imageBlock = image ? (
    <div
      className="min-h-[280px] md:min-h-[400px] bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    />
  ) : (
    <div className="min-h-[280px] md:min-h-[400px] bg-[rgb(var(--color-card-hover))] flex items-center justify-center text-[rgb(var(--color-muted-foreground))]">
      Image
    </div>
  );

  return (
    <section className="section-pad overflow-hidden">
      <div className="container-narrow">
        <div className="grid md:grid-cols-2 gap-0 rounded-[var(--radius-xl)] overflow-hidden shadow-soft-lg">
          {side === 'right' ? (
            <>
              {textBlock}
              {imageBlock}
            </>
          ) : (
            <>
              {imageBlock}
              {textBlock}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
