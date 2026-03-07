import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EmailTemplateEntity } from './email-template.entity';

@Entity('email_workflows')
export class EmailWorkflowEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64 })
  trigger: string;

  @Column({ type: 'uuid' })
  template_id: string;

  @ManyToOne(() => EmailTemplateEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  template: EmailTemplateEntity;

  @Column({ type: 'jsonb', default: {} })
  config: Record<string, unknown>;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
