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
    <section className="section-pad bg-[rgb(var(--color-card))]">
      <div className={`container-narrow ${className}`}>
        <div
          className="prose-custom prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-[rgb(var(--color-foreground))] prose-p:text-[rgb(var(--color-muted))] prose-a:text-[rgb(var(--color-accent))] prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
