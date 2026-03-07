import type { SectionTypeDefinition } from './types';
import type { TemplateType } from './types';

const allowedHomeLanding: TemplateType[] = ['home', 'landing'];
const allowedAll: TemplateType[] = ['home', 'product', 'blog_post', 'landing'];
const productOnly: TemplateType[] = ['product'];
const blogOnly: TemplateType[] = ['blog_post'];

export const SECTION_TYPES: SectionTypeDefinition[] = [
  {
    type_id: 'hero',
    name: 'Hero',
    category: 'Marketing',
    allowed_templates: allowedHomeLanding,
    default_settings: {
      heading: 'Welcome to our store',
      subheading: 'Discover amazing products',
      cta_text: 'Shop now',
      cta_url: '/collections/all',
      image: '',
      layout: 'center',
    },
    schema: {
      type: 'object',
      properties: {
        heading: { type: 'string', title: 'Heading' },
        subheading: { type: 'string', title: 'Subheading' },
        cta_text: { type: 'string', title: 'Button text' },
        cta_url: { type: 'string', title: 'Button URL' },
        image: { type: 'string', title: 'Image URL' },
        layout: { type: 'string', enum: ['left', 'right', 'center'], title: 'Layout' },
      },
    },
  },
  {
    type_id: 'product_grid',
    name: 'Product grid',
    category: 'Products',
    allowed_templates: allowedAll,
    default_settings: {
      title: 'Featured products',
      collection_handle: 'all',
      columns: 4,
      limit: 8,
    },
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', title: 'Section title' },
        collection_handle: { type: 'string', title: 'Collection handle' },
        columns: { type: 'number', title: 'Columns', default: 4 },
        limit: { type: 'number', title: 'Limit', default: 8 },
      },
    },
  },
  {
    type_id: 'featured_collection',
    name: 'Featured collection',
    category: 'Products',
    allowed_templates: allowedHomeLanding,
    default_settings: {
      collection_handle: 'featured',
      title: 'Featured collection',
      style: 'grid',
    },
    schema: {
      type: 'object',
      properties: {
        collection_handle: { type: 'string', title: 'Collection handle' },
        title: { type: 'string', title: 'Title' },
        style: { type: 'string', enum: ['grid', 'carousel'], title: 'Style' },
      },
    },
  },
  {
    type_id: 'rich_text',
    name: 'Rich text',
    category: 'Content',
    allowed_templates: allowedAll,
    default_settings: {
      content: '<p>Add your content here.</p>',
      max_width: 'medium',
    },
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', title: 'Content', format: 'html' },
        max_width: { type: 'string', enum: ['narrow', 'medium', 'wide', 'full'], title: 'Max width' },
      },
    },
  },
  {
    type_id: 'image_with_text',
    name: 'Image with text',
    category: 'Content',
    allowed_templates: allowedAll,
    default_settings: {
      image: '',
      heading: 'Headline',
      body: 'Describe your brand or promotion.',
      cta_text: 'Learn more',
      cta_url: '/pages/about',
      side: 'left',
    },
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', title: 'Image URL' },
        heading: { type: 'string', title: 'Heading' },
        body: { type: 'string', title: 'Body' },
        cta_text: { type: 'string', title: 'Button text' },
        cta_url: { type: 'string', title: 'Button URL' },
        side: { type: 'string', enum: ['left', 'right'], title: 'Image side' },
      },
    },
  },
  {
    type_id: 'faq',
    name: 'FAQ',
    category: 'Content',
    allowed_templates: allowedAll,
    default_settings: {
      title: 'Frequently asked questions',
      faq_source: 'manual',
      items: [],
    },
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', title: 'Section title' },
        faq_source: { type: 'string', enum: ['manual', 'global', 'product'], title: 'FAQ source' },
        items: {
          type: 'array',
          title: 'FAQ items',
          items: {
            type: 'object',
            properties: {
              question: { type: 'string' },
              answer: { type: 'string' },
            },
          },
        },
      },
    },
  },
  {
    type_id: 'testimonials',
    name: 'Testimonials',
    category: 'Marketing',
    allowed_templates: allowedHomeLanding,
    default_settings: {
      title: 'What our customers say',
      source: 'manual',
      limit: 3,
      items: [],
    },
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', title: 'Section title' },
        source: { type: 'string', enum: ['manual', 'reviews'], title: 'Source' },
        limit: { type: 'number', title: 'Limit', default: 3 },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              quote: { type: 'string' },
              author: { type: 'string' },
            },
          },
        },
      },
    },
  },
  {
    type_id: 'product_media',
    name: 'Product media',
    category: 'Product',
    allowed_templates: productOnly,
    default_settings: { layout: 'gallery' },
    schema: {
      type: 'object',
      properties: {
        layout: { type: 'string', enum: ['gallery', 'stacked'], title: 'Layout' },
      },
    },
  },
  {
    type_id: 'variant_picker',
    name: 'Variant picker',
    category: 'Product',
    allowed_templates: productOnly,
    default_settings: {},
    schema: { type: 'object', properties: {} },
  },
  {
    type_id: 'add_to_cart',
    name: 'Add to cart',
    category: 'Product',
    allowed_templates: productOnly,
    default_settings: { button_text: 'Add to cart' },
    schema: {
      type: 'object',
      properties: {
        button_text: { type: 'string', title: 'Button text' },
      },
    },
  },
  {
    type_id: 'product_description',
    name: 'Product description',
    category: 'Product',
    allowed_templates: productOnly,
    default_settings: {},
    schema: { type: 'object', properties: {} },
  },
  {
    type_id: 'post_title',
    name: 'Post title',
    category: 'Blog',
    allowed_templates: blogOnly,
    default_settings: {},
    schema: { type: 'object', properties: {} },
  },
  {
    type_id: 'post_content',
    name: 'Post content',
    category: 'Blog',
    allowed_templates: blogOnly,
    default_settings: {},
    schema: { type: 'object', properties: {} },
  },
  {
    type_id: 'related_posts',
    name: 'Related posts',
    category: 'Blog',
    allowed_templates: blogOnly,
    default_settings: { title: 'Related articles', limit: 3 },
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', title: 'Section title' },
        limit: { type: 'number', title: 'Limit', default: 3 },
      },
    },
  },
];

export function getSectionTypesForTemplate(templateType: TemplateType): SectionTypeDefinition[] {
  return SECTION_TYPES.filter((s) => s.allowed_templates.includes(templateType));
}

export function getSectionType(typeId: string): SectionTypeDefinition | undefined {
  return SECTION_TYPES.find((s) => s.type_id === typeId);
}
