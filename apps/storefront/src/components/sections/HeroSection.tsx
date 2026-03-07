import Link from 'next/link';

interface HeroSettings {
  heading?: string;
  subheading?: string;
  cta_text?: string;
  cta_url?: string;
  image?: string;
  layout?: 'left' | 'right' | 'center';
}

export function HeroSection({ settings }: { settings: HeroSettings }) {
  const {
    heading = '',
    subheading = '',
    cta_text = 'Shop now',
    cta_url = '/',
    image = '',
    layout = 'center',
  } = settings;

  const content = (
    <div className={`py-20 md:py-28 lg:py-36 px-6 md:px-10 ${layout === 'center' ? 'text-center' : layout === 'right' ? 'text-right md:ml-auto md:pl-16' : 'text-left md:mr-auto md:pr-16'}`}>
      <h1 className="heading-1 text-[rgb(var(--color-foreground))] mb-4 md:mb-6 max-w-3xl mx-auto">
        {heading}
      </h1>
      {subheading && (
        <p className="text-lg md:text-xl text-[rgb(var(--color-muted))] mb-8 md:mb-10 max-w-2xl mx-auto">
          {subheading}
        </p>
      )}
      {cta_url && (
        <Link
          href={cta_url}
          className="btn-primary inline-block"
        >
          {cta_text}
        </Link>
      )}
    </div>
  );

  if (image) {
    return (
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-full max-w-[var(--container-max)] mx-auto px-[var(--section-padding-x)]">
          <div className={`max-w-2xl ${layout === 'center' ? 'mx-auto' : ''}`}>
            {content}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[rgb(var(--color-card))]">
      <div className="container-narrow">
        <div className={`max-w-3xl ${layout === 'center' ? 'mx-auto' : ''}`}>
          {content}
        </div>
      </div>
    </section>
  );
}
