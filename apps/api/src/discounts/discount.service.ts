import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscountCodeEntity } from './entities/discount-code.entity';

export interface CreateDiscountCodeDto {
  code: string;
  type: 'percent' | 'fixed';
  value: string;
  min_order?: string;
  usage_limit?: number | null;
  valid_from?: string | null;
  valid_until?: string | null;
}

export interface UpdateDiscountCodeDto {
  code?: string;
  type?: 'percent' | 'fixed';
  value?: string;
  min_order?: string;
  usage_limit?: number | null;
  valid_from?: string | null;
  valid_until?: string | null;
}

export interface DiscountResult {
  valid: boolean;
  discount_amount?: number;
  code_entity?: DiscountCodeEntity;
  error?: string;
}

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountCodeEntity)
    private readonly repo: Repository<DiscountCodeEntity>,
  ) {}

  async findAll(): Promise<DiscountCodeEntity[]> {
    return this.repo.find({ order: { created_at: 'DESC' } });
  }

  async findOne(id: string): Promise<DiscountCodeEntity> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Discount code not found');
    return row;
  }

  async create(dto: CreateDiscountCodeDto): Promise<DiscountCodeEntity> {
    const code = dto.code.trim().toUpperCase();
    const existing = await this.repo.findOne({ where: { code } });
    if (existing) throw new BadRequestException('Code already exists');
    const row = this.repo.create({
      code,
      type: dto.type,
      value: dto.value,
      min_order: dto.min_order ?? '0',
      usage_limit: dto.usage_limit ?? null,
      used_count: 0,
      valid_from: dto.valid_from ? new Date(dto.valid_from) : null,
      valid_until: dto.valid_until ? new Date(dto.valid_until) : null,
    });
    return this.repo.save(row);
  }

  async update(id: string, dto: UpdateDiscountCodeDto): Promise<DiscountCodeEntity> {
    const row = await this.findOne(id);
    if (dto.code != null) row.code = dto.code.trim().toUpperCase();
    if (dto.type != null) row.type = dto.type;
    if (dto.value != null) row.value = dto.value;
    if (dto.min_order != null) row.min_order = dto.min_order;
    if (dto.usage_limit != null) row.usage_limit = dto.usage_limit;
    if (dto.valid_from != null) row.valid_from = dto.valid_from ? new Date(dto.valid_from) : null;
    if (dto.valid_until != null) row.valid_until = dto.valid_until ? new Date(dto.valid_until) : null;
    return this.repo.save(row);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  /**
   * Validate code and return discount amount for given subtotal. Does not increment used_count.
   */
  async validateCode(subtotal: number, codeInput: string): Promise<DiscountResult> {
    const code = codeInput?.trim()?.toUpperCase();
    if (!code) return { valid: false, error: 'No code provided' };

    const row = await this.repo.findOne({ where: { code } });
    if (!row) return { valid: false, error: 'Invalid code' };

    const now = new Date();
    if (row.valid_from && now < row.valid_from) return { valid: false, error: 'Code not yet valid' };
    if (row.valid_until && now > row.valid_until) return { valid: false, error: 'Code expired' };
    if (row.usage_limit != null && row.used_count >= row.usage_limit) return { valid: false, error: 'Code usage limit reached' };

    const minOrder = parseFloat(row.min_order);
    if (subtotal < minOrder) return { valid: false, error: `Minimum order is ${minOrder}` };

    const value = parseFloat(row.value);
    let discountAmount = 0;
    if (row.type === 'percent') {
      discountAmount = Math.round((subtotal * value) / 100 * 100) / 100;
    } else {
      discountAmount = Math.min(value, subtotal);
    }
    if (discountAmount <= 0) return { valid: false, error: 'No discount applied' };

    return { valid: true, discount_amount: discountAmount, code_entity: row };
  }

  /**
   * Apply code at checkout: validate and increment used_count. Returns discount amount.
   */
  async applyAndIncrement(subtotal: number, codeInput: string): Promise<{ discount_amount: number; code_id: string }> {
    const result = await this.validateCode(subtotal, codeInput);
    if (!result.valid || result.discount_amount == null || !result.code_entity) {
      throw new BadRequestException(result.error ?? 'Invalid discount code');
    }
    await this.repo.increment({ id: result.code_entity.id }, 'used_count', 1);
    return { discount_amount: result.discount_amount, code_id: result.code_entity.id };
  }
}
