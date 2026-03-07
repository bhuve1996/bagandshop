import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('chatbot_knowledge')
export class ChatbotKnowledgeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** JSONB array of strings or regex patterns to match user question */
  @Column({ type: 'jsonb', default: [] })
  question_patterns: string[];

  @Column({ type: 'text' })
  answer: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  category: string | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
