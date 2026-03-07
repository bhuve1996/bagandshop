interface TestimonialItem {
  quote?: string;
  author?: string;
}

interface TestimonialsSettings {
  title?: string;
  source?: string;
  limit?: number;
  items?: TestimonialItem[];
}

export function TestimonialsSection({ settings }: { settings: TestimonialsSettings }) {
  const { title = 'Testimonials', items = [] } = settings;

  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">{title}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.slice(0, 3).map((item, i) => (
            <blockquote key={i} className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-700 mb-4">&ldquo;{item.quote ?? ''}&rdquo;</p>
              <cite className="text-sm text-gray-500">— {item.author ?? ''}</cite>
            </blockquote>
          ))}
        </div>
        {items.length === 0 && (
          <p className="text-gray-500 text-center">No testimonials yet.</p>
        )}
      </div>
    </section>
  );
}
