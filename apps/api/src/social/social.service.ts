import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialFeedConfigEntity } from './entities/social-feed-config.entity';

export interface CreateSocialFeedConfigDto {
  platform: string;
  config?: Record<string, unknown>;
  is_active?: boolean;
}

export interface UpdateSocialFeedConfigDto {
  platform?: string;
  config?: Record<string, unknown>;
  is_active?: boolean;
}

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(SocialFeedConfigEntity)
    private readonly repo: Repository<SocialFeedConfigEntity>,
  ) {}

  async findAll(activeOnly = false): Promise<SocialFeedConfigEntity[]> {
    const qb = this.repo.createQueryBuilder('s').orderBy('s.platform', 'ASC');
    if (activeOnly) qb.andWhere('s.is_active = true');
    return qb.getMany();
  }

  async findOne(id: string): Promise<SocialFeedConfigEntity> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Social feed config not found');
    return row;
  }

  async create(dto: CreateSocialFeedConfigDto): Promise<SocialFeedConfigEntity> {
    const row = this.repo.create({
      platform: dto.platform,
      config: dto.config ?? {},
      is_active: dto.is_active ?? true,
    });
    return this.repo.save(row);
  }

  async update(id: string, dto: UpdateSocialFeedConfigDto): Promise<SocialFeedConfigEntity> {
    const row = await this.findOne(id);
    if (dto.platform != null) row.platform = dto.platform;
    if (dto.config != null) row.config = dto.config;
    if (dto.is_active != null) row.is_active = dto.is_active;
    return this.repo.save(row);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
