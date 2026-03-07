import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailWorkflowEntity } from './entities/email-workflow.entity';

export interface CreateEmailWorkflowDto {
  trigger: string;
  template_id: string;
  config?: Record<string, unknown>;
  is_active?: boolean;
}

export interface UpdateEmailWorkflowDto {
  trigger?: string;
  template_id?: string;
  config?: Record<string, unknown>;
  is_active?: boolean;
}

@Injectable()
export class EmailWorkflowService {
  constructor(
    @InjectRepository(EmailWorkflowEntity)
    private readonly repo: Repository<EmailWorkflowEntity>,
  ) {}

  async findAll(): Promise<EmailWorkflowEntity[]> {
    return this.repo.find({ relations: ['template'], order: { trigger: 'ASC' } });
  }

  async findOne(id: string): Promise<EmailWorkflowEntity> {
    const row = await this.repo.findOne({ where: { id }, relations: ['template'] });
    if (!row) throw new NotFoundException('Email workflow not found');
    return row;
  }

  async findByTrigger(trigger: string): Promise<EmailWorkflowEntity[]> {
    return this.repo.find({
      where: { trigger, is_active: true },
      relations: ['template'],
    });
  }

  async create(dto: CreateEmailWorkflowDto): Promise<EmailWorkflowEntity> {
    const row = this.repo.create({
      trigger: dto.trigger,
      template_id: dto.template_id,
      config: dto.config ?? {},
      is_active: dto.is_active ?? true,
    });
    return this.repo.save(row);
  }

  async update(id: string, dto: UpdateEmailWorkflowDto): Promise<EmailWorkflowEntity> {
    const row = await this.findOne(id);
    if (dto.trigger != null) row.trigger = dto.trigger;
    if (dto.template_id != null) row.template_id = dto.template_id;
    if (dto.config != null) row.config = dto.config;
    if (dto.is_active != null) row.is_active = dto.is_active;
    return this.repo.save(row);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
