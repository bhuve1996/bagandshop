import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DEFAULT_SITE_COPY } from '@bagandshop/shared';
import { ContentEntity } from './entities/content.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentEntity)
    private readonly contentRepo: Repository<ContentEntity>,
  ) {}

  /** Site-wide copy/config: defaults merged with DB overrides (DRY). */
  async getSiteConfig(locale = 'default'): Promise<Record<string, string>> {
    const fromDb = await this.getAll(locale);
    return { ...DEFAULT_SITE_COPY, ...fromDb };
  }

  async get(key: string, locale = 'default'): Promise<string | null> {
    const row = await this.contentRepo.findOne({
      where: { key, locale },
    });
    return row?.value ?? null;
  }

  async set(key: string, value: string, locale = 'default'): Promise<ContentEntity> {
    let row = await this.contentRepo.findOne({ where: { key, locale } });
    if (!row) {
      row = this.contentRepo.create({ key, locale, value });
    } else {
      row.value = value;
    }
    return this.contentRepo.save(row);
  }

  async getAll(locale = 'default'): Promise<Record<string, string>> {
    const rows = await this.contentRepo.find({ where: { locale } });
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }
}
