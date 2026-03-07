import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorEntity } from './entities/vendor.entity';
import { VendorProductMapping } from './entities/vendor-product-mapping.entity';
import { VendorInventory } from './entities/vendor-inventory.entity';
import { VendorRoutingRule } from './entities/vendor-routing-rule.entity';

export interface CreateVendorDto {
  name: string;
  code: string;
  api_type?: string;
  api_config?: Record<string, unknown>;
  pricing_rule?: Record<string, unknown>;
  priority?: number;
  is_active?: boolean;
}

export interface UpdateVendorDto {
  name?: string;
  code?: string;
  api_type?: string;
  api_config?: Record<string, unknown>;
  pricing_rule?: Record<string, unknown>;
  priority?: number;
  is_active?: boolean;
}

export interface CreateMappingDto {
  vendor_id: string;
  product_id: string;
  vendor_sku: string;
  vendor_data?: Record<string, unknown>;
}

export interface SyncResultDto {
  vendor_id: string;
  last_synced_at: string;
  inventory_updated?: number;
}

export interface RoutingRuleConditions {
  min_order?: number;
  region?: string | string[];
  product_tag?: string | string[];
}

export interface CreateRoutingRuleDto {
  name: string;
  conditions?: RoutingRuleConditions;
  priority?: number;
}

export interface UpdateRoutingRuleDto {
  name?: string;
  conditions?: RoutingRuleConditions;
  priority?: number;
}

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(VendorEntity)
    private readonly vendorRepo: Repository<VendorEntity>,
    @InjectRepository(VendorProductMapping)
    private readonly mappingRepo: Repository<VendorProductMapping>,
    @InjectRepository(VendorInventory)
    private readonly inventoryRepo: Repository<VendorInventory>,
    @InjectRepository(VendorRoutingRule)
    private readonly routingRuleRepo: Repository<VendorRoutingRule>,
  ) {}

  async create(dto: CreateVendorDto): Promise<VendorEntity> {
    const v = this.vendorRepo.create({
      name: dto.name,
      code: dto.code,
      api_type: dto.api_type ?? 'rest',
      api_config: dto.api_config ?? {},
      pricing_rule: dto.pricing_rule ?? {},
      priority: dto.priority ?? 0,
      is_active: dto.is_active ?? true,
    });
    return this.vendorRepo.save(v);
  }

  async findAll(activeOnly?: boolean): Promise<VendorEntity[]> {
    const qb = this.vendorRepo.createQueryBuilder('v').orderBy('v.priority', 'DESC').addOrderBy('v.name', 'ASC');
    if (activeOnly) qb.andWhere('v.is_active = true');
    return qb.getMany();
  }

  async findOne(id: string): Promise<VendorEntity> {
    const v = await this.vendorRepo.findOne({ where: { id } });
    if (!v) throw new NotFoundException('Vendor not found');
    return v;
  }

  async findOneWithRelations(id: string): Promise<VendorEntity> {
    const v = await this.vendorRepo.findOne({
      where: { id },
      relations: ['mappings', 'mappings.product', 'inventory', 'inventory.variant'],
    });
    if (!v) throw new NotFoundException('Vendor not found');
    return v;
  }

  async update(id: string, dto: UpdateVendorDto): Promise<VendorEntity> {
    const v = await this.findOne(id);
    if (dto.name != null) v.name = dto.name;
    if (dto.code != null) v.code = dto.code;
    if (dto.api_type != null) v.api_type = dto.api_type;
    if (dto.api_config != null) v.api_config = dto.api_config;
    if (dto.pricing_rule != null) v.pricing_rule = dto.pricing_rule;
    if (dto.priority != null) v.priority = dto.priority;
    if (dto.is_active != null) v.is_active = dto.is_active;
    return this.vendorRepo.save(v);
  }

  async remove(id: string): Promise<void> {
    await this.vendorRepo.delete(id);
  }

  async addMapping(dto: CreateMappingDto): Promise<VendorProductMapping> {
    const m = this.mappingRepo.create({
      vendor_id: dto.vendor_id,
      product_id: dto.product_id,
      vendor_sku: dto.vendor_sku,
      vendor_data: dto.vendor_data ?? {},
    });
    return this.mappingRepo.save(m);
  }

  async getMappings(vendorId: string): Promise<VendorProductMapping[]> {
    return this.mappingRepo.find({
      where: { vendor_id: vendorId },
      relations: ['product'],
    });
  }

  async removeMapping(id: string): Promise<void> {
    await this.mappingRepo.delete(id);
  }

  async getInventory(vendorId: string): Promise<VendorInventory[]> {
    return this.inventoryRepo.find({
      where: { vendor_id: vendorId },
      relations: ['variant', 'variant.product'],
    });
  }

  async setVendorInventory(vendorId: string, variantId: string, quantity: number, reserved = 0): Promise<VendorInventory> {
    let row = await this.inventoryRepo.findOne({
      where: { vendor_id: vendorId, variant_id: variantId },
    });
    if (!row) {
      row = this.inventoryRepo.create({
        vendor_id: vendorId,
        variant_id: variantId,
        quantity,
        reserved,
      });
    } else {
      row.quantity = quantity;
      row.reserved = reserved;
    }
    return this.inventoryRepo.save(row);
  }

  async sync(vendorId: string, inventoryUpdates?: Array<{ variant_id: string; quantity: number }>): Promise<SyncResultDto> {
    const vendor = await this.findOne(vendorId);
    const now = new Date();
    const mappingIds = await this.mappingRepo.find({ where: { vendor_id: vendorId }, select: ['id'] });
    if (mappingIds.length) {
      await this.mappingRepo.update({ vendor_id: vendorId }, { last_synced_at: now });
    }
    let inventoryUpdated = 0;
    if (inventoryUpdates?.length) {
      for (const u of inventoryUpdates) {
        await this.setVendorInventory(vendorId, u.variant_id, u.quantity);
        inventoryUpdated++;
      }
    }
    return {
      vendor_id: vendorId,
      last_synced_at: now.toISOString(),
      inventory_updated: inventoryUpdated,
    };
  }

  async listRoutingRules(vendorId: string): Promise<VendorRoutingRule[]> {
    return this.routingRuleRepo.find({
      where: { vendor_id: vendorId },
      order: { priority: 'DESC' },
    });
  }

  async createRoutingRule(vendorId: string, dto: CreateRoutingRuleDto): Promise<VendorRoutingRule> {
    await this.findOne(vendorId);
    const rule = this.routingRuleRepo.create({
      vendor_id: vendorId,
      name: dto.name,
      conditions: (dto.conditions ?? {}) as Record<string, unknown>,
      priority: dto.priority ?? 0,
    });
    return this.routingRuleRepo.save(rule);
  }

  async updateRoutingRule(ruleId: string, dto: UpdateRoutingRuleDto): Promise<VendorRoutingRule> {
    const rule = await this.routingRuleRepo.findOne({ where: { id: ruleId } });
    if (!rule) throw new NotFoundException('Routing rule not found');
    if (dto.name != null) rule.name = dto.name;
    if (dto.conditions != null) rule.conditions = dto.conditions as Record<string, unknown>;
    if (dto.priority != null) rule.priority = dto.priority;
    return this.routingRuleRepo.save(rule);
  }

  async deleteRoutingRule(ruleId: string): Promise<void> {
    await this.routingRuleRepo.delete(ruleId);
  }

  /**
   * Pick best vendor for an order line by product_id using mappings and routing rules.
   * Returns vendor_id or null if no mapping exists.
   */
  async pickVendorForLine(
    productId: string,
    orderTotal: number,
    shippingAddress: Record<string, unknown>,
    productMeta?: Record<string, unknown>,
  ): Promise<string | null> {
    const mappings = await this.mappingRepo.find({
      where: { product_id: productId },
      relations: ['vendor'],
    });
    if (mappings.length === 0) return null;
    const activeVendors = mappings
      .map((m) => m.vendor)
      .filter((v): v is VendorEntity => v != null && v.is_active);
    if (activeVendors.length === 0) return null;

    const vendorIds = activeVendors.map((v) => v.id);
    const rules = await this.routingRuleRepo.find({
      where: vendorIds.map((id) => ({ vendor_id: id })),
      order: { priority: 'DESC' },
    });
    const rulesByVendor = new Map<string, VendorRoutingRule[]>();
    for (const r of rules) {
      const list = rulesByVendor.get(r.vendor_id) ?? [];
      list.push(r);
      rulesByVendor.set(r.vendor_id, list);
    }

    const regionVal =
      (shippingAddress?.region as string) ??
      (shippingAddress?.country as string) ??
      (shippingAddress?.state as string) ??
      '';
    const tags: string[] = [];
    if (productMeta?.tags && Array.isArray(productMeta.tags)) {
      tags.push(...productMeta.tags.map(String));
    } else if (productMeta?.tag != null) {
      tags.push(String(productMeta.tag));
    }

    for (const rule of rules.sort((a, b) => (b.priority - a.priority))) {
      const cond = rule.conditions as RoutingRuleConditions;
      if (cond.min_order != null && orderTotal < cond.min_order) continue;
      if (cond.region != null) {
        const regions = Array.isArray(cond.region) ? cond.region : [cond.region];
        const normalized = regions.map((r) => String(r).toLowerCase());
        if (normalized.length && regionVal && !normalized.includes(regionVal.toLowerCase())) continue;
      }
      if (cond.product_tag != null && tags.length > 0) {
        const allowed = Array.isArray(cond.product_tag) ? cond.product_tag : [cond.product_tag];
        const allowedSet = new Set(allowed.map((t) => String(t).toLowerCase()));
        if (!tags.some((t) => allowedSet.has(t.toLowerCase()))) continue;
      }
      return rule.vendor_id;
    }

    const byPriority = [...activeVendors].sort((a, b) => b.priority - a.priority);
    return byPriority[0]?.id ?? null;
  }
}
