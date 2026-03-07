import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageEntity } from './entities/page.entity';
import { PageSection } from '../sections/entities/page-section.entity';
import type { TemplateType } from '@bagandshop/shared';

export interface CreatePageDto {
  slug: string;
  template_type: TemplateType;
  title: string;
  meta?: Record<string, unknown>;
  published_at?: string | null;
  context_id?: string | null;
}

export interface UpdatePageDto {
  slug?: string;
  title?: string;
  meta?: Record<string, unknown>;
  published_at?: string | null;
  context_id?: string | null;
}

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(PageEntity)
    private readonly pageRepo: Repository<PageEntity>,
    @InjectRepository(PageSection)
    private readonly sectionRepo: Repository<PageSection>,
  ) {}

  async create(dto: CreatePageDto): Promise<PageEntity> {
    const page = this.pageRepo.create({
      slug: dto.slug,
      template_type: dto.template_type,
      title: dto.title,
      meta: dto.meta ?? {},
      published_at: dto.published_at ? new Date(dto.published_at) : null,
      context_id: dto.context_id ?? null,
    });
    return this.pageRepo.save(page);
  }

  async findAll(template_type?: TemplateType): Promise<PageEntity[]> {
    const qb = this.pageRepo.createQueryBuilder('p').orderBy('p.updated_at', 'DESC');
    if (template_type) {
      qb.andWhere('p.template_type = :template_type', { template_type });
    }
    return qb.getMany();
  }

  async findOne(id: string): Promise<PageEntity> {
    const page = await this.pageRepo.findOne({ where: { id } });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async findOneWithSections(id: string): Promise<PageEntity & { sections: PageSection[] }> {
    const page = await this.pageRepo.findOne({
      where: { id },
      relations: ['sections'],
    });
    if (!page) throw new NotFoundException('Page not found');
    const sections = (page.sections ?? []).sort((a, b) => a.sort_order - b.sort_order);
    return { ...page, sections };
  }

  async findBySlug(slug: string): Promise<PageEntity | null> {
    return this.pageRepo.findOne({
      where: { slug },
      relations: ['sections'],
    });
  }

  async getPageForStorefront(
    slug?: string,
    templateType?: TemplateType,
    contextId?: string,
    preview = false,
  ): Promise<{
    page: PageEntity;
    sections: PageSection[];
  } | null> {
    if (slug) {
      const qb = this.pageRepo
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.sections', 's')
        .where('p.slug = :slug', { slug })
        .orderBy('s.sort_order', 'ASC');
      if (!preview) {
        qb.andWhere('p.published_at IS NOT NULL');
      }
      const page = await qb.getOne();
      if (!page) return null;
      const sections = (page.sections ?? []).sort(
        (a, b) => a.sort_order - b.sort_order,
      );
      return { page, sections };
    }
    if (templateType) {
      const page = await this.pageRepo
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.sections', 's')
        .where('p.template_type = :templateType', { templateType })
        .andWhere('(p.context_id IS NULL OR p.context_id = :contextId)', {
          contextId: contextId ?? null,
        })
        .andWhere(!preview ? 'p.published_at IS NOT NULL' : '1=1')
        .orderBy('s.sort_order', 'ASC')
        .getOne();
      if (!page) return null;
      return {
        page,
        sections: (page.sections ?? []).sort((a, b) => a.sort_order - b.sort_order),
      };
    }
    return null;
  }

  async update(id: string, dto: UpdatePageDto): Promise<PageEntity> {
    const page = await this.findOne(id);
    if (dto.slug != null) page.slug = dto.slug;
    if (dto.title != null) page.title = dto.title;
    if (dto.meta != null) page.meta = dto.meta;
    if (dto.published_at !== undefined)
      page.published_at = dto.published_at ? new Date(dto.published_at) : null;
    if (dto.context_id !== undefined) page.context_id = dto.context_id;
    return this.pageRepo.save(page);
  }

  async remove(id: string): Promise<void> {
    await this.pageRepo.delete(id);
  }
}
