interface FAQItem {
  question?: string;
  answer?: string;
}

interface FAQSettings {
  title?: string;
  faq_source?: string;
  items?: FAQItem[];
}

export function FAQSection({ settings }: { settings: FAQSettings }) {
  const { title = 'FAQ', items = [] } = settings;

  return (
    <section className="section-pad bg-[rgb(var(--color-card))]">
      <div className="container-narrow max-w-2xl">
        <h2 className="heading-2 text-[rgb(var(--color-foreground))] mb-8 text-center">{title}</h2>
        <ul className="space-y-6">
          {items.map((item, i) => (
            <li key={i} className="border-b border-[rgb(var(--color-border))] pb-6 last:border-0">
              <h3 className="font-semibold text-[rgb(var(--color-foreground))] mb-2">{item.question ?? ''}</h3>
              <p className="prose-custom text-sm">{item.answer ?? ''}</p>
            </li>
          ))}
        </ul>
        {items.length === 0 && (
          <p className="text-center text-[rgb(var(--color-muted))] py-8">No FAQ items yet.</p>
        )}
      </div>
    </section>
  );
}
