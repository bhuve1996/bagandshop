import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductMedia } from './entities/product-media.entity';
import { ProductFaq } from './entities/product-faq.entity';
import { ProductOption } from './entities/product-option.entity';
import { Variant } from './entities/variant.entity';

export interface CreateProductDto {
  handle: string;
  title: string;
  description?: string | null;
  body_html?: string | null;
  category_id?: string | null;
  meta?: Record<string, unknown>;
  status?: string;
  media?: Array<{ url: string; alt?: string | null; sort_order?: number; type?: string }>;
  faqs?: Array<{ question: string; answer: string; sort_order?: number }>;
  options?: Array<{ name: string; values: string[] }>;
  variants?: Array<{
    sku: string;
    title?: string | null;
    option_values?: Record<string, string>;
    price: string;
    compare_at_price?: string | null;
    inventory_quantity?: number;
    media_ids?: string[] | null;
  }>;
}

export interface UpdateProductDto {
  handle?: string;
  title?: string;
  description?: string | null;
  body_html?: string | null;
  category_id?: string | null;
  meta?: Record<string, unknown>;
  status?: string;
  media?: Array<{ id?: string; url: string; alt?: string | null; sort_order?: number; type?: string }>;
  faqs?: Array<{ id?: string; question: string; answer: string; sort_order?: number }>;
  options?: Array<{ id?: string; name: string; values: string[] }>;
  variants?: Array<{
    id?: string;
    sku: string;
    title?: string | null;
    option_values?: Record<string, string>;
    price: string;
    compare_at_price?: string | null;
    inventory_quantity?: number;
    media_ids?: string[] | null;
  }>;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(ProductMedia)
    private readonly mediaRepo: Repository<ProductMedia>,
    @InjectRepository(ProductFaq)
    private readonly faqRepo: Repository<ProductFaq>,
    @InjectRepository(ProductOption)
    private readonly optionRepo: Repository<ProductOption>,
    @InjectRepository(Variant)
    private readonly variantRepo: Repository<Variant>,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    const product = this.productRepo.create({
      handle: dto.handle,
      title: dto.title,
      description: dto.description ?? null,
      body_html: dto.body_html ?? null,
      category_id: dto.category_id ?? null,
      meta: dto.meta ?? {},
      status: dto.status ?? 'draft',
    });
    const saved = await this.productRepo.save(product);

    if (dto.media?.length) {
      for (const m of dto.media) {
        const row = this.mediaRepo.create({
          product_id: saved.id,
          url: m.url,
          alt: m.alt ?? null,
          sort_order: m.sort_order ?? 0,
          type: m.type ?? 'image',
        });
        await this.mediaRepo.save(row);
      }
    }
    if (dto.faqs?.length) {
      for (const f of dto.faqs) {
        const row = this.faqRepo.create({
          product_id: saved.id,
          question: f.question,
          answer: f.answer,
          sort_order: f.sort_order ?? 0,
        });
        await this.faqRepo.save(row);
      }
    }
    if (dto.options?.length) {
      for (const o of dto.options) {
        const row = this.optionRepo.create({
          product_id: saved.id,
          name: o.name,
          values: o.values,
        });
        await this.optionRepo.save(row);
      }
    }
    if (dto.variants?.length) {
      for (const v of dto.variants) {
        const row = this.variantRepo.create({
          product_id: saved.id,
          sku: v.sku,
          title: v.title ?? null,
          option_values: v.option_values ?? {},
          price: v.price,
          compare_at_price: v.compare_at_price ?? null,
          inventory_quantity: v.inventory_quantity ?? 0,
          media_ids: v.media_ids ?? null,
        });
        await this.variantRepo.save(row);
      }
    }

    return this.findOne(saved.id);
  }

  async findAll(categoryId?: string | null, status?: string): Promise<ProductEntity[]> {
    const qb = this.productRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'c')
      .orderBy('p.updated_at', 'DESC');
    if (categoryId !== undefined) {
      if (categoryId === null) qb.andWhere('p.category_id IS NULL');
      else qb.andWhere('p.category_id = :categoryId', { categoryId });
    }
    if (status) qb.andWhere('p.status = :status', { status });
    return qb.getMany();
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'media', 'faqs', 'options', 'variants'],
    });
    if (!product) throw new NotFoundException('Product not found');
    if (product.media) product.media.sort((a, b) => a.sort_order - b.sort_order);
    if (product.faqs) product.faqs.sort((a, b) => a.sort_order - b.sort_order);
    return product;
  }

  async findByHandle(handle: string): Promise<ProductEntity | null> {
    return this.productRepo.findOne({
      where: { handle, status: 'active' },
      relations: ['category', 'media', 'faqs', 'options', 'variants'],
    });
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    if (dto.handle != null) product.handle = dto.handle;
    if (dto.title != null) product.title = dto.title;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.body_html !== undefined) product.body_html = dto.body_html;
    if (dto.category_id !== undefined) product.category_id = dto.category_id;
    if (dto.meta != null) product.meta = dto.meta;
    if (dto.status != null) product.status = dto.status;
    await this.productRepo.save(product);

    if (dto.media !== undefined) {
      await this.mediaRepo.delete({ product_id: id });
      for (const m of dto.media) {
        const row = this.mediaRepo.create({
          product_id: id,
          url: m.url,
          alt: m.alt ?? null,
          sort_order: m.sort_order ?? 0,
          type: m.type ?? 'image',
        });
        await this.mediaRepo.save(row);
      }
    }
    if (dto.faqs !== undefined) {
      await this.faqRepo.delete({ product_id: id });
      for (const f of dto.faqs) {
        const row = this.faqRepo.create({
          product_id: id,
          question: f.question,
          answer: f.answer,
          sort_order: f.sort_order ?? 0,
        });
        await this.faqRepo.save(row);
      }
    }
    if (dto.options !== undefined) {
      await this.optionRepo.delete({ product_id: id });
      for (const o of dto.options) {
        const row = this.optionRepo.create({
          product_id: id,
          name: o.name,
          values: o.values,
        });
        await this.optionRepo.save(row);
      }
    }
    if (dto.variants !== undefined) {
      const existing = await this.variantRepo.find({ where: { product_id: id } });
      const byId = new Map(existing.map((v) => [v.id, v]));
      const keepIds = new Set<string>();
      for (const v of dto.variants) {
        if (v.id && byId.has(v.id)) {
          const row = byId.get(v.id)!;
          row.sku = v.sku;
          row.title = v.title ?? null;
          row.option_values = v.option_values ?? {};
          row.price = v.price;
          row.compare_at_price = v.compare_at_price ?? null;
          row.inventory_quantity = v.inventory_quantity ?? 0;
          row.media_ids = v.media_ids ?? null;
          await this.variantRepo.save(row);
          keepIds.add(row.id);
        } else {
          const row = this.variantRepo.create({
            product_id: id,
            sku: v.sku,
            title: v.title ?? null,
            option_values: v.option_values ?? {},
            price: v.price,
            compare_at_price: v.compare_at_price ?? null,
            inventory_quantity: v.inventory_quantity ?? 0,
            media_ids: v.media_ids ?? null,
          });
          const saved = await this.variantRepo.save(row);
          keepIds.add(saved.id);
        }
      }
      for (const v of existing) {
        if (!keepIds.has(v.id)) await this.variantRepo.remove(v);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.productRepo.delete(id);
  }
}
