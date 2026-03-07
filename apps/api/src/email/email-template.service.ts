import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplateEntity } from './entities/email-template.entity';

export interface CreateEmailTemplateDto {
  key: string;
  subject: string;
  body_html: string;
  variables?: string[];
}

export interface UpdateEmailTemplateDto {
  key?: string;
  subject?: string;
  body_html?: string;
  variables?: string[];
}

@Injectable()
export class EmailTemplateService {
  constructor(
    @InjectRepository(EmailTemplateEntity)
    private readonly repo: Repository<EmailTemplateEntity>,
  ) {}

  async findAll(): Promise<EmailTemplateEntity[]> {
    return this.repo.find({ order: { key: 'ASC' } });
  }

  async findOne(id: string): Promise<EmailTemplateEntity> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Email template not found');
    return row;
  }

  async findByKey(key: string): Promise<EmailTemplateEntity | null> {
    return this.repo.findOne({ where: { key } });
  }

  async create(dto: CreateEmailTemplateDto): Promise<EmailTemplateEntity> {
    const row = this.repo.create({
      key: dto.key,
      subject: dto.subject,
      body_html: dto.body_html,
      variables: Array.isArray(dto.variables) ? dto.variables : [],
    });
    return this.repo.save(row);
  }

  async update(id: string, dto: UpdateEmailTemplateDto): Promise<EmailTemplateEntity> {
    const row = await this.findOne(id);
    if (dto.key != null) row.key = dto.key;
    if (dto.subject != null) row.subject = dto.subject;
    if (dto.body_html != null) row.body_html = dto.body_html;
    if (dto.variables != null) row.variables = dto.variables;
    return this.repo.save(row);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  render(template: EmailTemplateEntity, variables: Record<string, string>): { subject: string; bodyHtml: string } {
    let subject = template.subject;
    let bodyHtml = template.body_html;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      subject = subject.replace(placeholder, value ?? '');
      bodyHtml = bodyHtml.replace(placeholder, value ?? '');
    }
    return { subject, bodyHtml };
  }
}
