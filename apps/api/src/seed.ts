import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '..', '.env') });

import { DataSource } from 'typeorm';
import { DEFAULT_SITE_COPY } from '@bagandshop/shared';
import { PageEntity } from './pages/entities/page.entity';
import { PageSection } from './sections/entities/page-section.entity';
import { ContentEntity } from './content/entities/content.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'bagandshop',
  entities: [PageEntity, PageSection, ContentEntity],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();
  const pageRepo = dataSource.getRepository(PageEntity);
  const sectionRepo = dataSource.getRepository(PageSection);
  const contentRepo = dataSource.getRepository(ContentEntity);

  // Seed site copy (idempotent: only insert missing keys)
  const copyDefaults = DEFAULT_SITE_COPY ?? {};
  for (const [key, value] of Object.entries(copyDefaults)) {
    const existing = await contentRepo.findOne({ where: { key, locale: 'default' } });
    if (!existing) {
      await contentRepo.save(contentRepo.create({ key, locale: 'default', value }));
    }
  }
  console.log('Site copy keys ensured');

  const existing = await pageRepo.findOne({ where: { slug: '/' } });
  if (existing) {
    console.log('Homepage already exists');
    await dataSource.destroy();
    return;
  }

  const page = pageRepo.create({
    slug: '/',
    template_type: 'home',
    title: 'Home',
    meta: { title: 'Bag and Shop', description: 'Welcome' },
    published_at: new Date(),
  });
  await pageRepo.save(page);

  const sections = [
    {
      section_type: 'hero',
      settings: {
        heading: 'Welcome to Bag and Shop',
        subheading: 'Discover amazing products',
        cta_text: 'Shop now',
        cta_url: '/collections/all',
        image: '',
        layout: 'center',
      },
      sort_order: 0,
    },
    {
      section_type: 'product_grid',
      settings: {
        title: 'Featured products',
        collection_handle: 'all',
        columns: 4,
        limit: 8,
      },
      sort_order: 1,
    },
    {
      section_type: 'rich_text',
      settings: {
        content: '<p>Your one-stop shop for quality products.</p>',
        max_width: 'medium',
      },
      sort_order: 2,
    },
  ];

  for (const s of sections) {
    const section = sectionRepo.create({
      page_id: page.id,
      section_type: s.section_type,
      settings: s.settings,
      sort_order: s.sort_order,
    });
    await sectionRepo.save(section);
  }

  console.log('Seeded homepage with sections');
  await dataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
