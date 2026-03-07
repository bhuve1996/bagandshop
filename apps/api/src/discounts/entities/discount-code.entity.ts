import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('discount_codes')
export class DiscountCodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 16 }) // 'percent' | 'fixed'
  type: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  value: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  min_order: string;

  @Column({ type: 'int', nullable: true })
  usage_limit: number | null;

  @Column({ type: 'int', default: 0 })
  used_count: number;

  @Column({ type: 'timestamptz', nullable: true })
  valid_from: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  valid_until: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
