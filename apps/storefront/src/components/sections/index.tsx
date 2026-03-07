import { HeroSection } from './HeroSection';
import { RichTextSection } from './RichTextSection';
import { ProductGridSection } from './ProductGridSection';
import { ImageWithTextSection } from './ImageWithTextSection';
import { FAQSection } from './FAQSection';
import { FeaturedCollectionSection } from './FeaturedCollectionSection';
import { TestimonialsSection } from './TestimonialsSection';

export interface SectionProps {
  settings: Record<string, unknown>;
  context?: Record<string, unknown>;
}

const SECTION_COMPONENTS: Record<string, React.ComponentType<SectionProps>> = {
  hero: HeroSection,
  rich_text: RichTextSection,
  product_grid: ProductGridSection,
  image_with_text: ImageWithTextSection,
  faq: FAQSection,
  featured_collection: FeaturedCollectionSection,
  testimonials: TestimonialsSection,
  product_media: () => <div className="py-8 text-center text-gray-500">Product media (context)</div>,
  variant_picker: () => <div className="py-8 text-center text-gray-500">Variant picker (context)</div>,
  add_to_cart: () => <div className="py-8 text-center text-gray-500">Add to cart (context)</div>,
  product_description: () => <div className="py-8 text-center text-gray-500">Product description (context)</div>,
  post_title: () => <div className="py-8 text-center text-gray-500">Post title (context)</div>,
  post_content: () => <div className="py-8 text-center text-gray-500">Post content (context)</div>,
  related_posts: () => <div className="py-8 text-center text-gray-500">Related posts (context)</div>,
};

export function getSectionComponent(type: string): React.ComponentType<SectionProps> | null {
  return SECTION_COMPONENTS[type] ?? null;
}

export { HeroSection, RichTextSection, ProductGridSection, ImageWithTextSection, FAQSection, FeaturedCollectionSection, TestimonialsSection };
