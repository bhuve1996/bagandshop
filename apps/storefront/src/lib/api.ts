const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const AUTH_TOKEN_KEY = 'bagandshop_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? getStoredToken() : null;
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  meta: Record<string, unknown>;
}

export interface ProductRecord {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  body_html: string | null;
  category_id: string | null;
  meta: Record<string, unknown>;
  status: string;
  category?: CategoryRecord | null;
  media?: Array<{ id: string; url: string; alt: string | null; sort_order: number; type: string }>;
  faqs?: Array<{ id: string; question: string; answer: string; sort_order: number }>;
  options?: Array<{ id: string; name: string; values: string[] }>;
  variants?: Array<{
    id: string;
    sku: string;
    title: string | null;
    option_values: Record<string, string>;
    price: string;
    compare_at_price: string | null;
    inventory_quantity: number;
  }>;
}

export interface PageResponse {
  page: {
    id: string;
    slug: string;
    template_type: string;
    title: string;
    meta: Record<string, unknown>;
    published_at: string | null;
    context_id: string | null;
    created_at: string;
    updated_at: string;
  };
  sections: Array<{
    id: string;
    page_id: string | null;
    section_type: string;
    settings: Record<string, unknown>;
    sort_order: number;
    visibility: Record<string, unknown> | null;
  }>;
}

export async function fetchPage(
  slug?: string,
  template?: string,
  contextId?: string,
  preview = false,
): Promise<PageResponse | null> {
  const params = new URLSearchParams();
  if (slug) params.set('slug', slug);
  if (template) params.set('template', template);
  if (contextId) params.set('context_id', contextId);
  if (preview) params.set('preview', '1');
  const res = await fetch(`${API_BASE}/pages/storefront?${params.toString()}`, {
    next: preview ? { revalidate: 0 } : { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchCategories(parentId?: string | null): Promise<CategoryRecord[]> {
  const params = new URLSearchParams();
  if (parentId !== undefined) params.set('parent_id', parentId === null ? 'null' : parentId);
  const res = await fetch(`${API_BASE}/categories?${params.toString()}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchCategoryBySlug(slug: string): Promise<CategoryRecord | null> {
  const res = await fetch(`${API_BASE}/categories/by-slug/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchProducts(categoryId?: string | null, status = 'active'): Promise<ProductRecord[]> {
  const params = new URLSearchParams();
  if (categoryId !== undefined) params.set('category_id', categoryId === null ? 'null' : categoryId);
  params.set('status', status);
  const res = await fetch(`${API_BASE}/products?${params.toString()}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchProductByHandle(handle: string): Promise<ProductRecord | null> {
  const res = await fetch(`${API_BASE}/products/by-handle/${handle}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export interface ComboItemRecord {
  id: string;
  combo_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  fixed_price: string | null;
  product?: ProductRecord;
  variant?: { id: string; sku: string; price: string; inventory_quantity: number };
}

export interface ComboRecord {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  meta: Record<string, unknown>;
  pricing_type: string;
  combo_price_or_percent: string;
  status: string;
  items?: ComboItemRecord[];
}

export async function fetchCombos(status = 'active'): Promise<ComboRecord[]> {
  const res = await fetch(`${API_BASE}/combos?status=${status}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchComboByHandle(handle: string): Promise<ComboRecord | null> {
  const res = await fetch(`${API_BASE}/combos/by-handle/${handle}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchComboInventory(comboId: string): Promise<number> {
  const res = await fetch(`${API_BASE}/combos/inventory/${comboId}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data.available ?? 0;
}

export interface CheckoutItem {
  product_id?: string | null;
  variant_id?: string | null;
  combo_id?: string | null;
  quantity: number;
  price: string;
}

export interface CheckoutPayload {
  email?: string | null;
  shipping_address: Record<string, unknown>;
  billing_address: Record<string, unknown>;
  items: CheckoutItem[];
  discount_code?: string | null;
}

export interface OrderLineRecord {
  id: string;
  product_id: string | null;
  variant_id: string | null;
  combo_id: string | null;
  quantity: number;
  price: string;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  status: string;
  fulfillment_status: string;
  totals: Record<string, unknown>;
  shipping_address: Record<string, unknown>;
  billing_address: Record<string, unknown>;
  email: string | null;
  created_at: string;
  lines?: OrderLineRecord[];
}

export async function checkoutOrder(payload: CheckoutPayload): Promise<OrderRecord> {
  const res = await fetch(`${API_BASE}/orders/checkout`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Auth
export interface UserRecord {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface LoginRegisterResponse {
  user: UserRecord;
  token: string;
  expires_at: string;
}

export async function authRegister(email: string, password: string, name?: string | null): Promise<LoginRegisterResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name: name || null }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function authLogin(email: string, password: string): Promise<LoginRegisterResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function authLogout(): Promise<void> {
  const token = getStoredToken();
  if (token) {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({}),
      });
    } catch {}
    setStoredToken(null);
  }
}

export async function authMe(): Promise<UserRecord | null> {
  const token = getStoredToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) return null;
  return res.json();
}

export interface ValidateDiscountResult {
  valid: boolean;
  discount_amount?: number;
  error?: string;
}

export async function validateDiscountCode(subtotal: number, code: string): Promise<ValidateDiscountResult> {
  const res = await fetch(`${API_BASE}/discounts/validate`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ subtotal, code: code.trim() }),
  });
  if (!res.ok) return { valid: false, error: 'Invalid' };
  return res.json();
}

export async function fetchMyOrders(): Promise<OrderRecord[]> {
  const res = await fetch(`${API_BASE}/orders/me`, { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchOrderByNumber(orderNumber: string, email?: string): Promise<OrderRecord | null> {
  const params = new URLSearchParams();
  if (email) params.set('email', email);
  const res = await fetch(`${API_BASE}/orders/by-number/${encodeURIComponent(orderNumber)}?${params.toString()}`);
  if (!res.ok) return null;
  return res.json();
}

// Reviews
export interface ReviewRecord {
  id: string;
  product_id: string;
  user_id: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  status: string;
  created_at: string;
}

export async function fetchProductReviews(productId: string): Promise<ReviewRecord[]> {
  const res = await fetch(`${API_BASE}/reviews/product/${productId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function submitReview(
  productId: string,
  rating: number,
  title?: string | null,
  body?: string | null,
  userId?: string | null,
): Promise<ReviewRecord> {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ product_id: productId, rating, title: title || null, body: body || null, user_id: userId || null }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Chatbot
export async function chatbotAsk(question: string): Promise<{ answer: string; category?: string | null } | null> {
  const res = await fetch(`${API_BASE}/chatbot/ask`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ question: question.trim() }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

// Social feeds
export interface SocialFeedConfigRecord {
  id: string;
  platform: string;
  config: Record<string, unknown>;
  is_active: boolean;
}

export async function fetchSocialFeeds(): Promise<SocialFeedConfigRecord[]> {
  const res = await fetch(`${API_BASE}/social/feeds?active=1`);
  if (!res.ok) return [];
  return res.json();
}
