export type TemplateType = 'home' | 'product' | 'blog_post' | 'landing';
export interface PageMeta {
    title?: string;
    description?: string;
    image?: string;
    noIndex?: boolean;
}
export interface Page {
    id: string;
    slug: string;
    template_type: TemplateType;
    title: string;
    meta: PageMeta;
    published_at: string | null;
    context_id: string | null;
    created_at: string;
    updated_at: string;
}
export interface SectionVisibility {
    devices?: ('desktop' | 'mobile' | 'tablet')[];
    start_date?: string;
    end_date?: string;
    audience?: string[];
}
export interface PageSection {
    id: string;
    page_id: string | null;
    section_type: string;
    settings: Record<string, unknown>;
    sort_order: number;
    visibility: SectionVisibility | null;
    created_at?: string;
    updated_at?: string;
}
export interface PageWithSections extends Page {
    sections: PageSection[];
}
export interface SectionTypeDefinition {
    type_id: string;
    name: string;
    category: string;
    schema: Record<string, unknown>;
    default_settings: Record<string, unknown>;
    preview_thumbnail?: string;
    allowed_templates: TemplateType[];
}
export interface PageContextProduct {
    id: string;
    handle: string;
    title: string;
    description?: string;
    [key: string]: unknown;
}
export interface PageContextPost {
    id: string;
    slug: string;
    title: string;
    content?: string;
    [key: string]: unknown;
}
export interface PageResponse {
    page: Page;
    sections: PageSection[];
    context?: {
        product?: PageContextProduct;
        post?: PageContextPost;
    };
}
