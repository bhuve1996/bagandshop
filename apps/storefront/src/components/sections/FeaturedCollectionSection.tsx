interface FeaturedCollectionSettings {
  collection_handle?: string;
  title?: string;
  style?: 'grid' | 'carousel';
}

export function FeaturedCollectionSection({ settings }: { settings: FeaturedCollectionSettings }) {
  const { title = 'Featured', style = 'grid' } = settings;

  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border rounded-lg bg-gray-50 aspect-square flex items-center justify-center text-gray-400"
            >
              Product
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
