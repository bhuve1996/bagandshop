import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './entities/review.entity';

export interface CreateReviewDto {
  product_id: string;
  user_id?: string | null;
  rating: number;
  title?: string | null;
  body?: string | null;
}

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly repo: Repository<ReviewEntity>,
  ) {}

  async findAll(status?: string): Promise<ReviewEntity[]> {
    const qb = this.repo.createQueryBuilder('r').leftJoinAndSelect('r.product', 'p').orderBy('r.created_at', 'DESC');
    if (status) qb.andWhere('r.status = :status', { status });
    return qb.getMany();
  }

  async findForProduct(productId: string, approvedOnly = true): Promise<ReviewEntity[]> {
    const qb = this.repo
      .createQueryBuilder('r')
      .where('r.product_id = :productId', { productId })
      .orderBy('r.created_at', 'DESC');
    if (approvedOnly) qb.andWhere('r.status = :status', { status: 'approved' });
    return qb.getMany();
  }

  async findOne(id: string): Promise<ReviewEntity> {
    const row = await this.repo.findOne({ where: { id }, relations: ['product'] });
    if (!row) throw new NotFoundException('Review not found');
    return row;
  }

  async create(dto: CreateReviewDto): Promise<ReviewEntity> {
    const rating = Number(dto.rating);
    if (rating < 1 || rating > 5) throw new BadRequestException('Rating must be 1–5');
    const row = this.repo.create({
      product_id: dto.product_id,
      user_id: dto.user_id ?? null,
      rating,
      title: dto.title?.trim() || null,
      body: dto.body?.trim() || null,
      status: 'pending',
    });
    return this.repo.save(row);
  }

  async updateStatus(id: string, status: string): Promise<ReviewEntity> {
    const row = await this.findOne(id);
    if (!['pending', 'approved', 'rejected'].includes(status)) throw new BadRequestException('Invalid status');
    row.status = status;
    return this.repo.save(row);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
