import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatbotKnowledgeEntity } from './entities/chatbot-knowledge.entity';

export interface CreateChatbotKnowledgeDto {
  question_patterns: string[];
  answer: string;
  category?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdateChatbotKnowledgeDto {
  question_patterns?: string[];
  answer?: string;
  category?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(ChatbotKnowledgeEntity)
    private readonly repo: Repository<ChatbotKnowledgeEntity>,
  ) {}

  async findAll(): Promise<ChatbotKnowledgeEntity[]> {
    return this.repo.find({ where: {}, order: { sort_order: 'ASC', created_at: 'ASC' } });
  }

  async findOne(id: string): Promise<ChatbotKnowledgeEntity> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Chatbot knowledge not found');
    return row;
  }

  async create(dto: CreateChatbotKnowledgeDto): Promise<ChatbotKnowledgeEntity> {
    const row = this.repo.create({
      question_patterns: Array.isArray(dto.question_patterns) ? dto.question_patterns : [],
      answer: dto.answer,
      category: dto.category ?? null,
      is_active: dto.is_active ?? true,
      sort_order: dto.sort_order ?? 0,
    });
    return this.repo.save(row);
  }

  async update(id: string, dto: UpdateChatbotKnowledgeDto): Promise<ChatbotKnowledgeEntity> {
    const row = await this.findOne(id);
    if (dto.question_patterns != null) row.question_patterns = dto.question_patterns;
    if (dto.answer != null) row.answer = dto.answer;
    if (dto.category !== undefined) row.category = dto.category;
    if (dto.is_active != null) row.is_active = dto.is_active;
    if (dto.sort_order != null) row.sort_order = dto.sort_order;
    return this.repo.save(row);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  /** Match question against active knowledge; returns first matching answer or null. */
  async ask(question: string): Promise<{ answer: string; category?: string | null } | null> {
    const q = question?.trim()?.toLowerCase() ?? '';
    if (!q) return null;

    const all = await this.repo.find({ where: { is_active: true }, order: { sort_order: 'ASC' } });
    for (const row of all) {
      const patterns = Array.isArray(row.question_patterns) ? row.question_patterns : [];
      for (const p of patterns) {
        const pattern = String(p).trim();
        if (!pattern) continue;
        try {
          const regex = new RegExp(pattern, 'i');
          if (regex.test(q)) return { answer: row.answer, category: row.category };
        } catch {
          if (q.includes(pattern.toLowerCase())) return { answer: row.answer, category: row.category };
        }
      }
    }
    return null;
  }
}
