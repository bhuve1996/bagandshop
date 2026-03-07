interface ProductGridSettings {
  title?: string;
  collection_handle?: string;
  columns?: number;
  limit?: number;
}

export function ProductGridSection({ settings }: { settings: ProductGridSettings }) {
  const { title = 'Products', columns = 4, limit = 8 } = settings;
  // Placeholder: in a full implementation this would fetch products from API
  const placeholderCount = Math.min(limit, 8);
  const gridCols = columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : 'grid-cols-4';

  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2 className="text-2xl font-bold mb-8 text-center">{title}</h2>
        )}
        <div className={`grid ${gridCols} gap-6`}>
          {Array.from({ length: placeholderCount }).map((_, i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden bg-gray-50 aspect-square flex items-center justify-center text-gray-400"
            >
              Product {i + 1}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
