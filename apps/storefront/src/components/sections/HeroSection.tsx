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
    <div className="py-16 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">{heading}</h1>
      {subheading && <p className="text-xl text-gray-600 mb-6">{subheading}</p>}
      {cta_url && (
        <Link
          href={cta_url}
          className="inline-block px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800"
        >
          {cta_text}
        </Link>
      )}
    </div>
  );

  if (image) {
    return (
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          {content}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-100">
      <div className={`max-w-4xl mx-auto ${layout === 'center' ? 'text-center' : ''}`}>
        {content}
      </div>
    </section>
  );
}
