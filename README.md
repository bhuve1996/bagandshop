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

Set `NEXT_PUBLIC_API_URL=http://localhost:3001` for admin/storefront if the API is not on the same host. Set `NEXT_PUBLIC_STOREFRONT_URL=http://localhost:3000` for canonical URLs, sitemap, and OpenGraph. Set `NEXT_PUBLIC_GA_ID` (e.g. `G-XXXX`) in the storefront to enable Google Analytics (add_to_cart and purchase events). Set `NEXT_PUBLIC_SITE_NAME` for the default site name in metadata (default: "Bag and Shop").

## Configurable copy (DRY)

All storefront labels and small text are configurable. Defaults live in **`packages/shared`** (`copy-defaults.ts`); the API merges DB overrides and exposes **`GET /content/site-config`**. The storefront fetches this once per layout and uses it via `useT(key)` (e.g. `t('nav.cart')`, `t('cart.empty')`). To change any string:

- **API**: `PUT /content` with body `{ "key": "site.name", "value": "My Store" }` (and optional `locale`). Keys match `packages/shared/src/copy-defaults.ts` (e.g. `site.name`, `nav.collections`, `cart.empty`, `auth.loginTitle`).
- **Seed**: `npm run db:seed` ensures all default keys exist in the `content` table so you can edit them (e.g. via a future admin “Site copy” screen).

Default pages (homepage, 404) use the same copy; the homepage is created by seed with section-based content.

## SEO & analytics

- **Storefront**: `/sitemap.xml` (dynamic; categories, products, combos), `/robots.txt`, OpenGraph and Twitter meta on product/combo pages, JSON-LD Product schema on product pages.
- **Analytics**: Provider-agnostic `trackEvent` in `lib/analytics.ts`; optional Google Analytics when `NEXT_PUBLIC_GA_ID` is set. Events: `add_to_cart`, `purchase` (on order confirmation).

## Deployment

**See [docs/WHERE-AND-DEPLOY.md](docs/WHERE-AND-DEPLOY.md)** for: where each app runs locally (URLs), what to deploy where, and step-by-step deployment (API, Admin, Storefront).

- **API**: Set `NODE_ENV=production` and ensure PostgreSQL is available. Disable TypeORM `synchronize` in production and use migrations if needed.
- **Admin / Storefront**: Build with `npm run build -w @bagandshop/admin` and `npm run build -w @bagandshop/storefront`. Set env for API URL and storefront URL. Serve with `next start` or your host’s Node runtime.

## Usage

- **Admin**: **Pages** (section builder), **Categories**, **Products** (with variants), **Combos**, **Vendors** (CRUD, product mapping, vendor inventory, Sync). Preview links to storefront.
- **Storefront**: Homepage and slug-based pages from section config. **/collections** and **/collections/[slug]** for categories and products; **/products/[handle]** for product detail; **/combos** and **/combos/[handle]** for bundles (combo inventory = min across items). Use `?preview=1` for unpublished pages.

## Shopify Instagram Reels API (Vercel)

This repo now includes a Vercel serverless function at `api/instagram-reels.js` for the Shopify section `sections/instagram-carousel.liquid`.

### Endpoint

- Public route (recommended in Theme Editor): `/apps/instagram-reels`
- Direct function route: `/api/instagram-reels`

### Query params

- `handles` (required): comma-separated handles, e.g. `instagram,natgeo`
- `limit` (optional): max reels to return (`1..24`, default `10`)

Example:

```bash
https://<your-vercel-domain>/apps/instagram-reels?handles=instagram&limit=10
```

### Required Vercel environment variables

- `IG_ACCESS_TOKEN` - long-lived Instagram Graph API token
- `IG_BUSINESS_USER_ID` - Instagram business account user id used for `business_discovery`
- `IG_GRAPH_VERSION` (optional) - defaults to `v21.0`
- `ALLOWED_ORIGIN` (optional) - CORS allow origin (default `*`)

### Vercel deployment (same repo)

1. Import this repository in Vercel.
2. Keep project root as repo root.
3. Add required env vars in Vercel project settings.
4. Deploy.
5. In Shopify Theme Editor -> `Instagram Reels Carousel`:
   - Set `Feed endpoint` to `https://<your-vercel-domain>/apps/instagram-reels`
   - Add Instagram handle blocks
   - Save

### Shopify CLI: 502 “Failed to render storefront” / Response body disturbed or locked

If `shopify theme dev` (or another command that **proxies your headless storefront**) fails with **502 Bad Gateway** and a stack trace mentioning **`patchProxiedResponseHeaders`**, **`extractBody`**, or **`Response body object should not be disturbed or locked`**, that usually comes from **Node.js 22+** and **stricter `fetch` / `Response` handling** in Node’s undici while the CLI patches the proxied HTTP response—not from this repo’s Next.js theme code.

**What to do:**

1. **Run Shopify CLI on Node 20 LTS** (recommended for `shopify` until CLI fully supports Node 22 for this path), for example:
   ```bash
   nvm install 20
   nvm use 20
   npm i -g @shopify/cli@latest
   shopify version
   ```
   Then retry `shopify theme dev` (or your storefront preview command).

2. **Upgrade the global CLI** so you pick up proxy fixes (e.g. skipping unsafe response patching for certain status codes): `npm i -g @shopify/cli@latest`.

3. If it still fails, run the **Next.js storefront** directly (`npm run storefront` → http://localhost:3000) to confirm the app is fine; the failure is between **CLI proxy ↔ Node**.

### Response shape

Returns:

```json
{
  "reels": [
    {
      "id": "1789...",
      "handle": "instagram",
      "caption": "...",
      "duration": 12,
      "thumbnail_url": "https://...",
      "video_url": "https://...",
      "permalink": "https://...",
      "timestamp": "2026-03-31T00:00:00+0000"
    }
  ],
  "meta": {
    "handles": ["instagram"],
    "limit": 10,
    "fetched_handles": 1,
    "warnings": []
  }
}
```
