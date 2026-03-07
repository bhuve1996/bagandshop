import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComboEntity } from './entities/combo.entity';
import { ComboItem } from './entities/combo-item.entity';
import { Variant } from '../products/entities/variant.entity';

export interface CreateComboDto {
  handle: string;
  title: string;
  description?: string | null;
  meta?: Record<string, unknown>;
  pricing_type?: string;
  combo_price_or_percent: string;
  status?: string;
  items: Array<{
    product_id: string;
    variant_id?: string | null;
    quantity: number;
    fixed_price?: string | null;
  }>;
}

export interface UpdateComboDto {
  handle?: string;
  title?: string;
  description?: string | null;
  meta?: Record<string, unknown>;
  pricing_type?: string;
  combo_price_or_percent?: string;
  status?: string;
  items?: Array<{
    id?: string;
    product_id: string;
    variant_id?: string | null;
    quantity: number;
    fixed_price?: string | null;
  }>;
}

@Injectable()
export class ComboService {
  constructor(
    @InjectRepository(ComboEntity)
    private readonly comboRepo: Repository<ComboEntity>,
    @InjectRepository(ComboItem)
    private readonly itemRepo: Repository<ComboItem>,
    @InjectRepository(Variant)
    private readonly variantRepo: Repository<Variant>,
  ) {}

  async create(dto: CreateComboDto): Promise<ComboEntity> {
    const combo = this.comboRepo.create({
      handle: dto.handle,
      title: dto.title,
      description: dto.description ?? null,
      meta: dto.meta ?? {},
      pricing_type: dto.pricing_type ?? 'fixed',
      combo_price_or_percent: dto.combo_price_or_percent,
      status: dto.status ?? 'draft',
    });
    const saved = await this.comboRepo.save(combo);
    for (const it of dto.items) {
      const item = this.itemRepo.create({
        combo_id: saved.id,
        product_id: it.product_id,
        variant_id: it.variant_id ?? null,
        quantity: it.quantity,
        fixed_price: it.fixed_price ?? null,
      });
      await this.itemRepo.save(item);
    }
    return this.findOne(saved.id);
  }

  async findAll(status?: string): Promise<ComboEntity[]> {
    const qb = this.comboRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.items', 'i')
      .leftJoinAndSelect('i.product', 'p')
      .leftJoinAndSelect('i.variant', 'v')
      .orderBy('c.updated_at', 'DESC');
    if (status) qb.andWhere('c.status = :status', { status });
    return qb.getMany();
  }

  async findOne(id: string): Promise<ComboEntity> {
    const combo = await this.comboRepo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'items.variant'],
    });
    if (!combo) throw new NotFoundException('Combo not found');
    return combo;
  }

  async findByHandle(handle: string): Promise<ComboEntity | null> {
    return this.comboRepo.findOne({
      where: { handle, status: 'active' },
      relations: ['items', 'items.product', 'items.variant'],
    });
  }

  async getComboInventory(comboId: string): Promise<number> {
    const items = await this.itemRepo.find({
      where: { combo_id: comboId },
      relations: ['variant'],
    });
    let minAvailable = Infinity;
    for (const item of items) {
      let qty = 0;
      if (item.variant_id && item.variant) {
        qty = item.variant.inventory_quantity;
      } else {
        const variants = await this.variantRepo.find({
          where: { product_id: item.product_id },
        });
        qty = variants.reduce((sum, v) => sum + v.inventory_quantity, 0);
      }
      const available = Math.floor(qty / item.quantity);
      if (available < minAvailable) minAvailable = available;
    }
    return minAvailable === Infinity ? 0 : minAvailable;
  }

  async update(id: string, dto: UpdateComboDto): Promise<ComboEntity> {
    const combo = await this.comboRepo.findOne({ where: { id } });
    if (!combo) throw new NotFoundException('Combo not found');

    if (dto.handle != null) combo.handle = dto.handle;
    if (dto.title != null) combo.title = dto.title;
    if (dto.description !== undefined) combo.description = dto.description;
    if (dto.meta != null) combo.meta = dto.meta;
    if (dto.pricing_type != null) combo.pricing_type = dto.pricing_type;
    if (dto.combo_price_or_percent != null) combo.combo_price_or_percent = dto.combo_price_or_percent;
    if (dto.status != null) combo.status = dto.status;
    await this.comboRepo.save(combo);

    if (dto.items !== undefined) {
      await this.itemRepo.delete({ combo_id: id });
      for (const it of dto.items) {
        const item = this.itemRepo.create({
          combo_id: id,
          product_id: it.product_id,
          variant_id: it.variant_id ?? null,
          quantity: it.quantity,
          fixed_price: it.fixed_price ?? null,
        });
        await this.itemRepo.save(item);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.comboRepo.delete(id);
  }
}
