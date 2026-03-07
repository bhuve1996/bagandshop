const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export interface PageRecord {
  id: string;
  slug: string;
  template_type: string;
  title: string;
  meta: Record<string, unknown>;
  published_at: string | null;
  context_id: string | null;
  created_at: string;
  updated_at: string;
  sections?: SectionRecord[];
}

export interface SectionRecord {
  id: string;
  page_id: string | null;
  section_type: string;
  settings: Record<string, unknown>;
  sort_order: number;
  visibility: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface SectionTypeDef {
  type_id: string;
  name: string;
  category: string;
  schema: Record<string, unknown>;
  default_settings: Record<string, unknown>;
  allowed_templates: string[];
}

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  meta: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProductMediaRecord {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  type: string;
}

export interface ProductFaqRecord {
  id: string;
  product_id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export interface ProductOptionRecord {
  id: string;
  product_id: string;
  name: string;
  values: string[];
}

export interface VariantRecord {
  id: string;
  product_id: string;
  sku: string;
  title: string | null;
  option_values: Record<string, string>;
  price: string;
  compare_at_price: string | null;
  inventory_quantity: number;
  media_ids: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export interface ComboItemRecord {
  id: string;
  combo_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  fixed_price: string | null;
  product?: ProductRecord;
  variant?: VariantRecord;
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
  created_at: string;
  updated_at: string;
  items?: ComboItemRecord[];
}

export interface VendorRecord {
  id: string;
  name: string;
  code: string;
  api_type: string;
  api_config: Record<string, unknown>;
  pricing_rule: Record<string, unknown>;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  mappings?: VendorMappingRecord[];
  inventory?: VendorInventoryRecord[];
}

export interface VendorMappingRecord {
  id: string;
  vendor_id: string;
  product_id: string;
  vendor_sku: string;
  vendor_data: Record<string, unknown>;
  last_synced_at: string | null;
  product?: ProductRecord;
}

export interface VendorInventoryRecord {
  id: string;
  vendor_id: string;
  variant_id: string;
  quantity: number;
  reserved: number;
  updated_at: string;
  variant?: VariantRecord & { product?: ProductRecord };
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
  created_at: string;
  updated_at: string;
  category?: CategoryRecord | null;
  media?: ProductMediaRecord[];
  faqs?: ProductFaqRecord[];
  options?: ProductOptionRecord[];
  variants?: VariantRecord[];
}

export interface OrderLineRecord {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  combo_id: string | null;
  quantity: number;
  price: string;
  vendor_id: string | null;
  vendor_order_ref: string | null;
}

export interface OrderEventRecord {
  id: string;
  order_id: string;
  type: string;
  payload: Record<string, unknown>;
  source: string;
  created_at: string;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  customer_id: string | null;
  status: string;
  fulfillment_status: string;
  vendor_id: string | null;
  totals: Record<string, unknown>;
  shipping_address: Record<string, unknown>;
  billing_address: Record<string, unknown>;
  email: string | null;
  created_at: string;
  updated_at: string;
  lines?: OrderLineRecord[];
  events?: OrderEventRecord[];
}

export interface VendorRoutingRuleRecord {
  id: string;
  vendor_id: string;
  name: string;
  conditions: { min_order?: number; region?: string | string[]; product_tag?: string | string[] };
  priority: number;
}

export interface DiscountCodeRecord {
  id: string;
  code: string;
  type: string;
  value: string;
  min_order: string;
  usage_limit: number | null;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplateRecord {
  id: string;
  key: string;
  subject: string;
  body_html: string;
  variables: string[];
  created_at: string;
  updated_at: string;
}

export interface EmailWorkflowRecord {
  id: string;
  trigger: string;
  template_id: string;
  config: Record<string, unknown>;
  is_active: boolean;
  template?: EmailTemplateRecord;
}

export interface ReviewRecord {
  id: string;
  product_id: string;
  user_id: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  product?: ProductRecord;
}

export interface ChatbotKnowledgeRecord {
  id: string;
  question_patterns: string[];
  answer: string;
  category: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SocialFeedConfigRecord {
  id: string;
  platform: string;
  config: Record<string, unknown>;
  is_active: boolean;
}

export const api = {
  orders: {
    list: (limit?: number) =>
      fetchApi<OrderRecord[]>(limit ? `/orders?limit=${limit}` : '/orders'),
    get: (id: string) => fetchApi<OrderRecord>(`/orders/${id}`),
    getByNumber: (orderNumber: string) =>
      fetchApi<OrderRecord>(`/orders/by-number/${encodeURIComponent(orderNumber)}`),
    updateStatus: (id: string, status: string, fulfillment_status?: string) =>
      fetchApi<OrderRecord>(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, fulfillment_status }),
      }),
  },
  categories: {
    list: (parentId?: string | null) =>
      fetchApi<CategoryRecord[]>(
        parentId === undefined
          ? '/categories'
          : parentId === null
            ? '/categories?parent_id=null'
            : `/categories?parent_id=${parentId}`,
      ),
    get: (id: string) => fetchApi<CategoryRecord>(`/categories/${id}`),
    getBySlug: (slug: string) => fetchApi<CategoryRecord>(`/categories/by-slug/${slug}`),
    create: (body: Partial<CategoryRecord>) =>
      fetchApi<CategoryRecord>('/categories', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Partial<CategoryRecord>) =>
      fetchApi<CategoryRecord>(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      fetchApi<void>(`/categories/${id}`, { method: 'DELETE' }),
  },
  vendors: {
    list: (activeOnly?: boolean) =>
      fetchApi<VendorRecord[]>(activeOnly ? '/vendors?active=1' : '/vendors'),
    get: (id: string) => fetchApi<VendorRecord>(`/vendors/${id}`),
    create: (body: Partial<VendorRecord> & { name: string; code: string }) =>
      fetchApi<VendorRecord>('/vendors', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<VendorRecord>) =>
      fetchApi<VendorRecord>(`/vendors/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => fetchApi<void>(`/vendors/${id}`, { method: 'DELETE' }),
    getMappings: (vendorId: string) => fetchApi<VendorMappingRecord[]>(`/vendors/${vendorId}/mappings`),
    addMapping: (body: { vendor_id: string; product_id: string; vendor_sku: string; vendor_data?: Record<string, unknown> }) =>
      fetchApi<VendorMappingRecord>('/vendors/mappings', { method: 'POST', body: JSON.stringify(body) }),
    removeMapping: (mappingId: string) =>
      fetchApi<void>(`/vendors/mappings/${mappingId}`, { method: 'DELETE' }),
    getInventory: (vendorId: string) => fetchApi<VendorInventoryRecord[]>(`/vendors/${vendorId}/inventory`),
    setInventory: (vendorId: string, variantId: string, quantity: number, reserved?: number) =>
      fetchApi<VendorInventoryRecord>(`/vendors/${vendorId}/inventory`, {
        method: 'PUT',
        body: JSON.stringify({ variant_id: variantId, quantity, reserved: reserved ?? 0 }),
      }),
    sync: (vendorId: string, inventory?: Array<{ variant_id: string; quantity: number }>) =>
      fetchApi<{ vendor_id: string; last_synced_at: string; inventory_updated?: number }>(`/vendors/${vendorId}/sync`, {
        method: 'POST',
        body: JSON.stringify(inventory ? { inventory } : {}),
      }),
    getRoutingRules: (vendorId: string) =>
      fetchApi<VendorRoutingRuleRecord[]>(`/vendors/${vendorId}/routing-rules`),
    createRoutingRule: (vendorId: string, body: { name: string; conditions?: Record<string, unknown>; priority?: number }) =>
      fetchApi<VendorRoutingRuleRecord>(`/vendors/${vendorId}/routing-rules`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    updateRoutingRule: (vendorId: string, ruleId: string, body: { name?: string; conditions?: Record<string, unknown>; priority?: number }) =>
      fetchApi<VendorRoutingRuleRecord>(`/vendors/${vendorId}/routing-rules/${ruleId}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    deleteRoutingRule: (vendorId: string, ruleId: string) =>
      fetchApi<void>(`/vendors/${vendorId}/routing-rules/${ruleId}`, { method: 'DELETE' }),
  },
  combos: {
    list: (status?: string) =>
      fetchApi<ComboRecord[]>(status ? `/combos?status=${status}` : '/combos'),
    get: (id: string) => fetchApi<ComboRecord>(`/combos/${id}`),
    getByHandle: (handle: string) => fetchApi<ComboRecord>(`/combos/by-handle/${handle}`),
    getInventory: (id: string) => fetchApi<{ available: number }>(`/combos/inventory/${id}`),
    create: (body: Partial<ComboRecord> & { handle: string; title: string; combo_price_or_percent: string; items: Array<{ product_id: string; variant_id?: string | null; quantity: number; fixed_price?: string | null }> }) =>
      fetchApi<ComboRecord>('/combos', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<ComboRecord>) =>
      fetchApi<ComboRecord>(`/combos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => fetchApi<void>(`/combos/${id}`, { method: 'DELETE' }),
  },
  products: {
    list: (categoryId?: string | null, status?: string) => {
      const params = new URLSearchParams();
      if (categoryId !== undefined) params.set('category_id', categoryId === null ? 'null' : categoryId);
      if (status) params.set('status', status);
      return fetchApi<ProductRecord[]>(`/products?${params.toString()}`);
    },
    get: (id: string) => fetchApi<ProductRecord>(`/products/${id}`),
    getByHandle: (handle: string) => fetchApi<ProductRecord>(`/products/by-handle/${handle}`),
    create: (body: Partial<ProductRecord> & { handle: string; title: string }) =>
      fetchApi<ProductRecord>('/products', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Partial<ProductRecord>) =>
      fetchApi<ProductRecord>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      fetchApi<void>(`/products/${id}`, { method: 'DELETE' }),
  },
  pages: {
    list: (template?: string) =>
      fetchApi<PageRecord[]>(
        template ? `/pages?template_type=${template}` : '/pages',
      ),
    get: (id: string) => fetchApi<PageRecord>(`/pages/${id}`),
    create: (body: Partial<PageRecord>) =>
      fetchApi<PageRecord>('/pages', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Partial<PageRecord>) =>
      fetchApi<PageRecord>(`/pages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      fetchApi<void>(`/pages/${id}`, { method: 'DELETE' }),
  },
  sections: {
    types: (template?: string) =>
      fetchApi<SectionTypeDef[]>(
        template ? `/sections/types?template=${template}` : '/sections/types',
      ),
    getType: (typeId: string) =>
      fetchApi<SectionTypeDef>(`/sections/types/${typeId}`),
    list: (pageId: string) =>
      fetchApi<SectionRecord[]>(`/sections/page/${pageId}`),
    create: (body: {
      page_id: string | null;
      section_type: string;
      settings?: Record<string, unknown>;
      sort_order?: number;
      visibility?: Record<string, unknown> | null;
    }) =>
      fetchApi<SectionRecord>('/sections', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (
      id: string,
      body: Partial<{
        settings: Record<string, unknown>;
        sort_order: number;
        visibility: Record<string, unknown> | null;
      }>,
    ) =>
      fetchApi<SectionRecord>(`/sections/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    reorder: (pageId: string, sectionIds: string[]) =>
      fetchApi<SectionRecord[]>(`/sections/page/${pageId}/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ section_ids: sectionIds }),
      }),
    delete: (id: string) =>
      fetchApi<void>(`/sections/${id}`, { method: 'DELETE' }),
  },
  discounts: {
    list: () => fetchApi<DiscountCodeRecord[]>('/discounts'),
    get: (id: string) => fetchApi<DiscountCodeRecord>(`/discounts/${id}`),
    create: (body: { code: string; type: 'percent' | 'fixed'; value: string; min_order?: string; usage_limit?: number | null; valid_from?: string | null; valid_until?: string | null }) =>
      fetchApi<DiscountCodeRecord>('/discounts', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<DiscountCodeRecord>) =>
      fetchApi<DiscountCodeRecord>(`/discounts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => fetchApi<void>(`/discounts/${id}`, { method: 'DELETE' }),
    validate: (subtotal: number, code: string) =>
      fetchApi<{ valid: boolean; discount_amount?: number; error?: string }>('/discounts/validate', {
        method: 'POST',
        body: JSON.stringify({ subtotal, code }),
      }),
  },
  email: {
    templates: {
      list: () => fetchApi<EmailTemplateRecord[]>('/email/templates'),
      get: (id: string) => fetchApi<EmailTemplateRecord>(`/email/templates/${id}`),
      create: (body: { key: string; subject: string; body_html: string; variables?: string[] }) =>
        fetchApi<EmailTemplateRecord>('/email/templates', { method: 'POST', body: JSON.stringify(body) }),
      update: (id: string, body: Partial<EmailTemplateRecord>) =>
        fetchApi<EmailTemplateRecord>(`/email/templates/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
      delete: (id: string) => fetchApi<void>(`/email/templates/${id}`, { method: 'DELETE' }),
    },
    workflows: {
      list: () => fetchApi<EmailWorkflowRecord[]>('/email/workflows'),
      get: (id: string) => fetchApi<EmailWorkflowRecord>(`/email/workflows/${id}`),
      create: (body: { trigger: string; template_id: string; config?: Record<string, unknown>; is_active?: boolean }) =>
        fetchApi<EmailWorkflowRecord>('/email/workflows', { method: 'POST', body: JSON.stringify(body) }),
      update: (id: string, body: Partial<EmailWorkflowRecord>) =>
        fetchApi<EmailWorkflowRecord>(`/email/workflows/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
      delete: (id: string) => fetchApi<void>(`/email/workflows/${id}`, { method: 'DELETE' }),
    },
  },
  reviews: {
    list: (status?: string) =>
      fetchApi<ReviewRecord[]>(status ? `/reviews?status=${status}` : '/reviews'),
    get: (id: string) => fetchApi<ReviewRecord>(`/reviews/${id}`),
    updateStatus: (id: string, status: string) =>
      fetchApi<ReviewRecord>(`/reviews/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    delete: (id: string) => fetchApi<void>(`/reviews/${id}`, { method: 'DELETE' }),
  },
  chatbot: {
    list: () => fetchApi<ChatbotKnowledgeRecord[]>('/chatbot/knowledge'),
    get: (id: string) => fetchApi<ChatbotKnowledgeRecord>(`/chatbot/knowledge/${id}`),
    create: (body: { question_patterns: string[]; answer: string; category?: string | null; is_active?: boolean; sort_order?: number }) =>
      fetchApi<ChatbotKnowledgeRecord>('/chatbot/knowledge', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<ChatbotKnowledgeRecord>) =>
      fetchApi<ChatbotKnowledgeRecord>(`/chatbot/knowledge/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => fetchApi<void>(`/chatbot/knowledge/${id}`, { method: 'DELETE' }),
  },
  social: {
    list: (activeOnly?: boolean) =>
      fetchApi<SocialFeedConfigRecord[]>(activeOnly ? '/social/feeds?active=1' : '/social/feeds'),
    get: (id: string) => fetchApi<SocialFeedConfigRecord>(`/social/feeds/${id}`),
    create: (body: { platform: string; config?: Record<string, unknown>; is_active?: boolean }) =>
      fetchApi<SocialFeedConfigRecord>('/social/feeds', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<SocialFeedConfigRecord>) =>
      fetchApi<SocialFeedConfigRecord>(`/social/feeds/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => fetchApi<void>(`/social/feeds/${id}`, { method: 'DELETE' }),
  },
};
