interface RichTextSettings {
  content?: string;
  max_width?: 'narrow' | 'medium' | 'wide' | 'full';
}

const widthClass = {
  narrow: 'max-w-2xl',
  medium: 'max-w-4xl',
  wide: 'max-w-6xl',
  full: 'max-w-full',
};

export function RichTextSection({ settings }: { settings: RichTextSettings }) {
  const { content = '', max_width = 'medium' } = settings;
  const className = widthClass[max_width] ?? widthClass.medium;

  return (
    <section className="py-12 px-6">
      <div className={`mx-auto ${className}`}>
        <div
          className="prose prose-gray"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
