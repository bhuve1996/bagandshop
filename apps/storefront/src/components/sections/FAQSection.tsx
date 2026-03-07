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
    <section className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">{title}</h2>
        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={i} className="border-b pb-4">
              <h3 className="font-semibold mb-2">{item.question ?? ''}</h3>
              <p className="text-gray-600 text-sm">{item.answer ?? ''}</p>
            </li>
          ))}
        </ul>
        {items.length === 0 && (
          <p className="text-gray-500 text-center">No FAQ items yet.</p>
        )}
      </div>
    </section>
  );
}
