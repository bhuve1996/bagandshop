import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,
  ) {}

  async create(dto: { name: string; slug: string; parent_id?: string | null; sort_order?: number; meta?: Record<string, unknown> }): Promise<CategoryEntity> {
    const cat = this.repo.create({
      name: dto.name,
      slug: dto.slug,
      parent_id: dto.parent_id ?? null,
      sort_order: dto.sort_order ?? 0,
      meta: dto.meta ?? {},
    });
    return this.repo.save(cat);
  }

  async findAll(parentId?: string | null): Promise<CategoryEntity[]> {
    const qb = this.repo.createQueryBuilder('c').orderBy('c.sort_order', 'ASC').addOrderBy('c.name', 'ASC');
    if (parentId === undefined) {
      // return all
    } else if (parentId === null) {
      qb.andWhere('c.parent_id IS NULL');
    } else {
      qb.andWhere('c.parent_id = :parentId', { parentId });
    }
    return qb.getMany();
  }

  async findOne(id: string): Promise<CategoryEntity> {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async findBySlug(slug: string): Promise<CategoryEntity | null> {
    return this.repo.findOne({ where: { slug } });
  }

  async update(id: string, dto: Partial<{ name: string; slug: string; parent_id: string | null; sort_order: number; meta: Record<string, unknown> }>): Promise<CategoryEntity> {
    const cat = await this.findOne(id);
    if (dto.name != null) cat.name = dto.name;
    if (dto.slug != null) cat.slug = dto.slug;
    if (dto.parent_id !== undefined) cat.parent_id = dto.parent_id;
    if (dto.sort_order != null) cat.sort_order = dto.sort_order;
    if (dto.meta != null) cat.meta = dto.meta;
    return this.repo.save(cat);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
