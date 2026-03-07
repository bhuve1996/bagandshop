# Bag and Shop — Complete Architecture Plan

This document is the **single source of truth** for the full eCommerce platform. It reflects the Complete Architecture Prompt: config-driven, provider-agnostic, dashboard-controlled, with products/variants/combos, dropshipping vendors, order routing, SEO, automation, analytics, chatbot, and marketing.

**Status:** Plan approved → implement in phases below. Do not implement features that are not listed in this plan.

---

## 1. Core Architectural Principles

| Principle | Requirement |
|-----------|-------------|
| **Configuration-driven** | Features controlled via config; admin configures behavior in dashboards; frontend supports schema-driven rendering; new layouts/sections without code deploy where possible. |
| **Dashboard-controlled UI** | Admin configures: homepage sections, product page sections, blog layout, landing pages, banners, featured products, category highlights, section order, visibility rules. Pages composed from configurable sections. |
| **Text & content configurable** | All visible text editable from dashboard/CMS: homepage text, product labels, banners, CTAs, marketing copy, help/FAQ, chatbot responses. |
| **Provider-agnostic** | All infra (DB, email, payment, storage) behind interfaces/adapters. Switching e.g. Supabase→Railway, SES→SendGrid, Razorpay→Stripe, Cloudinary→S3 = config/env only, no logic changes. |
| **Modular architecture** | Independent modules: product, vendor, inventory, order, marketing, notification, analytics, SEO. Each scalable and extendable. |

---

## 2. Tech Stack (Recommended)

| Layer | Choice | Notes |
|-------|--------|--------|
| **Frontend (storefront)** | Next.js, React, Tailwind | SSR/SSG for SEO; mobile responsive; CDN-friendly. |
| **Frontend (admin)** | Next.js, React, Tailwind | Same stack; dashboard UI. |
| **Backend** | Node.js, NestJS | API-driven; modular; TypeScript. |
| **Database** | PostgreSQL | JSONB for flexible config; strong consistency. |
| **Infrastructure** | Cloud hosting, CDN, object storage | Provider-agnostic (env-driven). |

---

## 3. Database Schema Design

### 3.1 Already implemented (page builder)

- **pages** — id, slug, template_type, title, meta (JSONB), published_at, context_id, created_at, updated_at
- **page_sections** — id, page_id, section_type, settings (JSONB), sort_order, visibility (JSONB), created_at, updated_at
- **content** — id, key, locale, value (site-wide copy)

### 3.2 Products, variants, combos

- **categories** — id, name, slug, parent_id, sort_order, meta (JSONB), created_at, updated_at
- **products** — id, handle, title, description, body_html, category_id, meta (JSONB: SEO, badges), status, created_at, updated_at
- **product_media** — id, product_id, url, alt, sort_order, type (image/video)
- **product_faqs** — id, product_id, question, answer, sort_order
- **product_options** — id, product_id, name (e.g. Size, Color), values (JSONB array)
- **variants** — id, product_id, sku, title, option_values (JSONB), price, compare_at_price, inventory_quantity, vendor_inventory (see 3.4), media_ids (JSONB), created_at, updated_at
- **combos** — id, handle, title, description, meta (JSONB), pricing_type (fixed/percentage), combo_price_or_percent, status, created_at, updated_at
- **combo_items** — id, combo_id, product_id, variant_id (optional), quantity, fixed_price (optional)

### 3.3 Vendors and dropshipping

- **vendors** — id, name, code, api_type (rest/webhook/feed), api_config (JSONB: base_url, auth, etc.), pricing_rule (JSONB), priority, is_active, created_at, updated_at
- **vendor_product_mapping** — id, vendor_id, product_id, vendor_sku, vendor_data (JSONB), last_synced_at
- **vendor_inventory** — id, vendor_id, variant_id (or vendor_sku), quantity, reserved, updated_at
- **vendor_routing_rules** — id, vendor_id, name, conditions (JSONB: min_order, region, product_tag), priority

### 3.4 Orders and fulfillment

- **orders** — id, order_number, customer_id, status, fulfillment_status, vendor_id (assigned), totals (JSONB), shipping_address (JSONB), billing_address (JSONB), created_at, updated_at
- **order_lines** — id, order_id, product_id, variant_id, combo_id (optional), quantity, price, vendor_id (optional), vendor_order_ref
- **order_events** — id, order_id, type (placed, accepted, shipped, delivered, cancelled), payload (JSONB), source (api/webhook/manual), created_at

### 3.5 Users and auth

- **users** — id, email, password_hash, name, created_at, updated_at
- **sessions** — id, user_id, token, expires_at

### 3.6 Marketing and content

- **discount_codes** — id, code, type (percent/fixed), value, min_order, usage_limit, used_count, valid_from, valid_until, created_at, updated_at
- **campaigns** — id, name, type, config (JSONB), is_active, created_at, updated_at
- **email_templates** — id, key, subject, body_html, variables (JSONB), created_at, updated_at
- **email_workflows** — id, trigger (order_placed, shipped, abandoned_cart, etc.), template_id, config (JSONB), is_active
- **chatbot_knowledge** — id, question_patterns (JSONB), answer, category, is_active, sort_order, created_at, updated_at
- **social_feed_config** — id, platform (instagram, twitter, youtube, tiktok), config (JSONB), is_active

### 3.7 Reviews and analytics

- **reviews** — id, product_id, user_id, rating, title, body, status (pending/approved/rejected), created_at, updated_at
- **analytics_events** — id, type, payload (JSONB), created_at (or use external provider; schema optional)

---

## 4. Product + Variant + Combo Architecture

- **Product**: title, description, media, category, SEO meta, FAQs, badges, pricing (from default variant or range). Options define variant dimensions (size, color, etc.).
- **Variant**: one row per combination of options; unique SKU; variant pricing; variant inventory (and vendor_inventory); optional variant media.
- **Combo**: behaves like a product (has handle, can go in cart). Contains multiple products/variants with quantities. Pricing: fixed bundle price or percentage off. Combo “inventory” derived from constituent variant inventory (e.g. min available across items).

---

## 5. Vendor Management and Dropshipping

- **Vendor management**: Admin CRUD vendors; configure API (type, base URL, auth); pricing rules; priority.
- **Vendor product sync**: Jobs or webhooks fetch vendor product/price/inventory; map to store products via vendor_product_mapping; update variant/vendor_inventory.
- **Vendor inventory**: Stored per vendor (vendor_inventory). Available inventory = sum or min by routing rule (e.g. by vendor priority or region).
- **Order routing**: On order placement, assign vendor per line (or whole order) using vendor_routing_rules (stock, price, shipping speed, priority). Persist vendor_id on order / order_lines.
- **Vendor order updates**: Vendors send updates (accepted, processed, shipped, delivered, cancelled) via API or webhook. Persist in order_events; update order/fulfillment status; trigger customer notifications (email automation).

---

## 6. Storefront Requirements (from plan)

- Homepage (section-driven) ✅ existing
- Category pages (list products by category)
- Product listing pages (search, filters)
- Product detail pages (variants, add to cart, FAQs, badges, combos)
- Search and product filters
- Shopping cart
- Checkout and payment gateway integration
- Order tracking
- User login (email)
- Product reviews, FAQs, badges, combos/bundles
- SEO optimized, mobile responsive, fast, accessible

---

## 7. Admin Dashboard Requirements (from plan)

- **Product management**: products, variants, combos, media, FAQs, badges, SEO meta
- **Vendor management**: vendors, vendor APIs, product mapping, vendor inventory, pricing, routing rules
- **Sales dashboard**: revenue, order stats, top products/combos, vendor performance, conversion, refunds
- **Inventory management**: product/variant stock, vendor inventory, low-stock alerts
- **Review management**: moderate reviews, approve/reject, flag spam
- **Page/section builder** ✅ existing (homepage, product template, blog template, landing pages)

---

## 8. Marketing and Campaigns

- Discount codes (admin-defined; applied at checkout)
- Campaigns and sales events (config-driven)
- Featured products and product badges (configurable)
- All marketing settings editable in dashboard

---

## 9. Email Automation

- Workflows: order confirmation, processing updates, shipping, delivery, abandoned cart, checkout abandonment, promotional
- Admin configures: templates, triggers, workflow config
- Provider-agnostic: send via adapter (e.g. SES, SendGrid) from config

---

## 10. Chatbot

- FAQ-style responses; configurable Q&A
- Customer assistance (e.g. help, order status)
- Admin manages chatbot knowledge (chatbot_knowledge table)

---

## 11. Social Media Integration

- Configurable live feeds: Instagram, Twitter/X, YouTube, TikTok
- Stored config in social_feed_config; display on storefront via sections or widgets

---

## 12. SEO System

- Dynamic meta tags, canonical URLs
- sitemap.xml, robots.txt
- OpenGraph tags, structured product schema (JSON-LD)
- SEO-friendly URLs; all SEO settings configurable in dashboard

---

## 13. Analytics

- Traffic, sales, campaign tracking, behavior, conversion
- Integrations: Google Analytics and/or custom (provider-agnostic adapter)

---

## 14. Provider-Agnostic Infrastructure

- **Database**: Abstract repository or adapter so switching host (e.g. Supabase vs Railway) is config.
- **Email**: EmailService interface; implementations for SES, SendGrid, etc.; chosen by env.
- **Payment**: PaymentGateway interface; implementations for Razorpay, Stripe, etc.; chosen by config.
- **Storage**: MediaStorage interface; implementations for Cloudinary, S3, etc.; chosen by config.

---

## 15. Development Roadmap (Phases)

Implementation order. Each phase is “done” when backend + admin + storefront (where applicable) work for that scope.

| Phase | Scope | Deliverables |
|-------|--------|---------------|
| **Phase 1** | Page builder + content | ✅ Done (pages, page_sections, content, section types, admin editor, storefront renderer) |
| **Phase 2** | Products, variants, categories | Categories CRUD; products CRUD with media, FAQs, options; variants with SKU, price, inventory; storefront category/product listing and product detail (no cart yet). |
| **Phase 3** | Combos | Combo + combo_items; admin CRUD; storefront display and “add combo to cart” behavior; combo inventory logic. |
| **Phase 4** | Vendors and sync | Vendors CRUD; vendor API config; vendor_product_mapping; sync job or webhook for product/price/inventory; vendor_inventory; admin vendor and mapping UI. |
| **Phase 5** | Cart, checkout, orders | Cart (session or user); checkout flow; payment adapter (one provider); orders + order_lines; order status; basic order tracking on storefront. |
| **Phase 6** | Order routing and vendor updates | vendor_routing_rules; assign vendor on order; order_events; webhook/API for vendor updates; status sync and customer notifications (email). |
| **Phase 7** | Users and auth | users, sessions; login/register (email); protected account area; order history. |
| **Phase 8** | Marketing and email | discount_codes, campaigns; apply discount at checkout; email_templates, email_workflows; adapter for sending; abandoned cart + order emails. |
| **Phase 9** | Reviews, chatbot, social | reviews CRUD and moderation; storefront reviews; chatbot_knowledge and simple chatbot UI; social_feed_config and feed widgets. |
| **Phase 10** | SEO, analytics, polish | sitemap.xml, robots.txt, OpenGraph, product schema; analytics adapter and events; provider-agnostic wiring; deployment and scalability notes. |

---

## 16. Implementation Rules

1. **Follow this plan only** — No feature that isn’t described here. If the prompt has something not in the plan, add it to this document first, then implement.
2. **Config over code** — Use config/DB/dashboard for behavior and copy where the plan says “configurable” or “dashboard-controlled.”
3. **Provider-agnostic** — Use interfaces/adapters for DB, email, payment, storage; choose implementation via config/env.
4. **Modular** — One NestJS module per domain (product, vendor, order, marketing, etc.); clear boundaries.
5. **Storefront and admin** — Every new entity/feature that needs UI has corresponding admin screens and storefront behavior as per the plan.

---

*Document version: 1.0. Last updated: plan created. Implement in order of Phase 2 → Phase 10.*
