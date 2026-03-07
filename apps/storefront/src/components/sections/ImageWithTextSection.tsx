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
    <div className="flex flex-col justify-center p-8">
      {heading && <h2 className="text-2xl font-bold mb-4">{heading}</h2>}
      {body && <p className="text-gray-600 mb-6">{body}</p>}
      {cta_url && (
        <Link href={cta_url} className="text-blue-600 font-medium hover:underline">
          {cta_text}
        </Link>
      )}
    </div>
  );

  const imageBlock = image ? (
    <div
      className="min-h-[300px] bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    />
  ) : (
    <div className="min-h-[300px] bg-gray-200 flex items-center justify-center text-gray-400">
      Image
    </div>
  );

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-0">
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
    </section>
  );
}
