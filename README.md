# Bag and Shop

Headless eCommerce platform with section-based page builder, products/variants/combos, dropshipping vendors, and config-driven admin. Built with NestJS, Next.js, and PostgreSQL.

**Architecture:** See **[docs/ARCHITECTURE-PLAN.md](docs/ARCHITECTURE-PLAN.md)** for the full plan (products, variants, combos, vendors, orders, marketing, SEO, analytics, roadmap). Implementation follows that document.

## Structure

- **apps/api** – NestJS backend (pages, sections, content, categories, products/variants, combos, **vendors**). PostgreSQL.
- **apps/admin** – Next.js admin (pages, categories, products, combos, **vendors**; page editor with sections).
- **apps/storefront** – Next.js storefront (section-driven pages, collections, product listing/detail, combos).
- **packages/shared** – Shared types and section type definitions.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **PostgreSQL**
   - Create a database (e.g. `bagandshop`).
   - Set env (optional, defaults shown):
     - `DB_HOST=localhost`
     - `DB_PORT=5432`
     - `DB_USER=postgres`
     - `DB_PASSWORD=postgres`
     - `DB_NAME=bagandshop`

3. **Run API** (creates tables via TypeORM synchronize in dev)
   ```bash
   npm run api
   ```
   API: http://localhost:3001

4. **Seed homepage** (optional)
   ```bash
   npm run db:seed
   ```

5. **Run admin**
   ```bash
   npm run admin
   ```
   Admin: http://localhost:3002

6. **Run storefront**
   ```bash
   npm run storefront
   ```
   Storefront: http://localhost:3000

Set `NEXT_PUBLIC_API_URL=http://localhost:3001` for admin/storefront if the API is not on the same host. Set `NEXT_PUBLIC_STOREFRONT_URL=http://localhost:3000` for canonical URLs, sitemap, and OpenGraph. Set `NEXT_PUBLIC_GA_ID` (e.g. `G-XXXX`) in the storefront to enable Google Analytics (add_to_cart and purchase events).

## SEO & analytics

- **Storefront**: `/sitemap.xml` (dynamic; categories, products, combos), `/robots.txt`, OpenGraph and Twitter meta on product/combo pages, JSON-LD Product schema on product pages.
- **Analytics**: Provider-agnostic `trackEvent` in `lib/analytics.ts`; optional Google Analytics when `NEXT_PUBLIC_GA_ID` is set. Events: `add_to_cart`, `purchase` (on order confirmation).

## Deployment

- **API**: Set `NODE_ENV=production` and ensure PostgreSQL is available. Disable TypeORM `synchronize` in production and use migrations if needed.
- **Admin / Storefront**: Build with `npm run build -w @bagandshop/admin` and `npm run build -w @bagandshop/storefront`. Set env for API URL and storefront URL. Serve with `next start` or your host’s Node runtime.

## Usage

- **Admin**: **Pages** (section builder), **Categories**, **Products** (with variants), **Combos**, **Vendors** (CRUD, product mapping, vendor inventory, Sync). Preview links to storefront.
- **Storefront**: Homepage and slug-based pages from section config. **/collections** and **/collections/[slug]** for categories and products; **/products/[handle]** for product detail; **/combos** and **/combos/[handle]** for bundles (combo inventory = min across items). Use `?preview=1` for unpublished pages.
