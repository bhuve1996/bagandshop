# Where to see what & where to deploy

## What runs where (local)

When you run `npm run dev`:

| App | URL | What it is |
|-----|-----|------------|
| **Storefront** | http://localhost:3000 | Customer-facing shop (homepage, collections, products, combos). |
| **API** | http://localhost:3001 | Backend (NestJS). Serves data for admin and storefront. |
| **Admin** | http://localhost:3002 | Internal dashboard: pages, categories, products, combos, vendors. |

- **Customers** use the **storefront** (3000).
- **You** use the **admin** (3002) to manage content; it talks to the **API** (3001).

---

## Where to deploy what

You have **3 deployable pieces**:

1. **API** (NestJS + PostgreSQL)
2. **Admin** (Next.js)
3. **Storefront** (Next.js)

### 1. API

- **What:** Node app in `apps/api`. Needs a **PostgreSQL** database.
- **Deploy to:** Any host that runs Node and can connect to PostgreSQL, e.g.:
  - **Railway**, **Render**, **Fly.io**, **DigitalOcean App Platform**
  - Or a VPS (e.g. **DigitalOcean Droplet**, **AWS EC2**) with Node + PM2 and a managed Postgres (e.g. **Supabase**, **Neon**, **Railway DB**).
- **Steps:**
  - Set env: `NODE_ENV=production`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`.
  - In production, **turn off** TypeORM `synchronize` (use migrations instead).
  - Build: from repo root run `npm run build -w @bagandshop/shared` then `npm run build -w @bagandshop/api`.
  - Run: `node apps/api/dist/main.js` (from repo root) or `node dist/main.js` from `apps/api`.
- **Result:** One public URL for the API (e.g. `https://api.yoursite.com` or the URL your host gives you).

### 2. Admin

- **What:** Next.js app in `apps/admin`. Only for you/team; not for customers.
- **Deploy to:** Same kind of hosts as any Next.js app, e.g. **Vercel**, **Railway**, **Render**, **Netlify**.
- **Steps:**
  - Set env at **build time**: `NEXT_PUBLIC_API_URL=<your-api-url>` (e.g. `https://api.yoursite.com`).
  - Build: `npm run build -w @bagandshop/admin`.
  - Run: `npm run start -w @bagandshop/admin` (or your host’s “start” command for the built app).
- **Result:** One URL for the admin (e.g. `https://admin.yoursite.com`). Only share with staff.

### 3. Storefront

- **What:** Next.js app in `apps/storefront`. The public shop.
- **Deploy to:** **Vercel**, **Netlify**, **Railway**, **Render**, etc.
- **Steps:**
  - Set env at **build time**:
    - `NEXT_PUBLIC_API_URL=<your-api-url>`
    - `NEXT_PUBLIC_STOREFRONT_URL=<storefront-url>` (e.g. `https://yoursite.com`) for canonical URLs, sitemap, OpenGraph.
    - Optional: `NEXT_PUBLIC_GA_ID=G-XXXX` for Google Analytics.
  - Build: `npm run build -w @bagandshop/storefront`.
  - Run: `npm run start -w @bagandshop/storefront` (or host’s equivalent).
- **Result:** One URL for the store (e.g. `https://yoursite.com`).

---

## Order of deployment

1. **Database:** Create PostgreSQL (e.g. Supabase/Neon/Railway) and note host, port, user, password, DB name.
2. **API:** Deploy `apps/api`, point it to that DB, get the API URL.
3. **Admin:** Deploy `apps/admin` with `NEXT_PUBLIC_API_URL=<API URL>`.
4. **Storefront:** Deploy `apps/storefront` with `NEXT_PUBLIC_API_URL=<API URL>` and `NEXT_PUBLIC_STOREFRONT_URL=<storefront URL>`.

---

## Quick reference

| Question | Answer |
|---------|--------|
| Where do I see the shop? | http://localhost:3000 (storefront) |
| Where do I manage content? | http://localhost:3002 (admin) |
| Where is the backend? | http://localhost:3001 (API) |
| Deploy API where? | Railway, Render, Fly.io, VPS + Node; need Postgres (Supabase, Neon, etc.) |
| Deploy Admin where? | Vercel, Netlify, Railway, Render (Next.js) |
| Deploy Storefront where? | Vercel, Netlify, Railway, Render (Next.js) |
