import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageSection } from './entities/page-section.entity';
import {
  SECTION_TYPES,
  getSectionType,
  getSectionTypesForTemplate,
} from '@bagandshop/shared';
import type { TemplateType } from '@bagandshop/shared';

export interface CreateSectionDto {
  page_id: string | null;
  section_type: string;
  settings?: Record<string, unknown>;
  sort_order?: number;
  visibility?: Record<string, unknown> | null;
}

export interface UpdateSectionDto {
  settings?: Record<string, unknown>;
  sort_order?: number;
  visibility?: Record<string, unknown> | null;
}

export interface ReorderSectionsDto {
  section_ids: string[];
}

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(PageSection)
    private readonly sectionRepo: Repository<PageSection>,
  ) {}

  getSectionTypes(templateType?: TemplateType) {
    if (templateType) {
      return getSectionTypesForTemplate(templateType);
    }
    return SECTION_TYPES;
  }

  getSectionType(typeId: string) {
    return getSectionType(typeId);
  }

  async create(dto: CreateSectionDto): Promise<PageSection> {
    const def = getSectionType(dto.section_type);
    const settings = dto.settings ?? def?.default_settings ?? {};
    const section = this.sectionRepo.create({
      page_id: dto.page_id,
      section_type: dto.section_type,
      settings: { ...(def?.default_settings ?? {}), ...settings },
      sort_order: dto.sort_order ?? 0,
      visibility: dto.visibility ?? null,
    });
    return this.sectionRepo.save(section);
  }

  async findByPageId(pageId: string): Promise<PageSection[]> {
    return this.sectionRepo.find({
      where: { page_id: pageId },
      order: { sort_order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<PageSection> {
    const section = await this.sectionRepo.findOne({ where: { id } });
    if (!section) throw new NotFoundException('Section not found');
    return section;
  }

  async update(id: string, dto: UpdateSectionDto): Promise<PageSection> {
    const section = await this.findOne(id);
    if (dto.settings != null) section.settings = dto.settings;
    if (dto.sort_order != null) section.sort_order = dto.sort_order;
    if (dto.visibility !== undefined) section.visibility = dto.visibility;
    return this.sectionRepo.save(section);
  }

  async reorder(pageId: string, sectionIds: string[]): Promise<PageSection[]> {
    const sections = await this.findByPageId(pageId);
    const idToSection = new Map(sections.map((s) => [s.id, s]));
    let order = 0;
    for (const id of sectionIds) {
      const section = idToSection.get(id);
      if (section && section.sort_order !== order) {
        section.sort_order = order;
        await this.sectionRepo.save(section);
      }
      order++;
    }
    return this.findByPageId(pageId);
  }

  async remove(id: string): Promise<void> {
    await this.sectionRepo.delete(id);
  }
}
