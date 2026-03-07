import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ComboItem } from './combo-item.entity';

@Entity('combos')
export class ComboEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  handle: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'jsonb', default: {} })
  meta: Record<string, unknown>;

  @Column({ type: 'varchar', length: 32, default: 'fixed' })
  pricing_type: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  combo_price_or_percent: string;

  @Column({ type: 'varchar', length: 32, default: 'draft' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ComboItem, (i) => i.combo)
  items: ComboItem[];
}
