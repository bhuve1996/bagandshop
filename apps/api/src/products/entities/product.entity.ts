import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { ProductMedia } from './product-media.entity';
import { ProductFaq } from './product-faq.entity';
import { ProductOption } from './product-option.entity';
import { Variant } from './variant.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  handle: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  body_html: string | null;

  @Column({ type: 'uuid', nullable: true })
  category_id: string | null;

  @ManyToOne(() => CategoryEntity, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity | null;

  @Column({ type: 'jsonb', default: {} })
  meta: Record<string, unknown>;

  @Column({ type: 'varchar', length: 32, default: 'draft' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ProductMedia, (m) => m.product)
  media: ProductMedia[];

  @OneToMany(() => ProductFaq, (f) => f.product)
  faqs: ProductFaq[];

  @OneToMany(() => ProductOption, (o) => o.product)
  options: ProductOption[];

  @OneToMany(() => Variant, (v) => v.product)
  variants: Variant[];
}
