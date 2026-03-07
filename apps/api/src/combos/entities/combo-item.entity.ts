import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ComboEntity } from './combo.entity';
import { ProductEntity } from '../../products/entities/product.entity';
import { Variant } from '../../products/entities/variant.entity';

@Entity('combo_items')
export class ComboItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  combo_id: string;

  @ManyToOne(() => ComboEntity, (c) => c.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'combo_id' })
  combo: ComboEntity;

  @Column({ type: 'uuid' })
  product_id: string;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({ type: 'uuid', nullable: true })
  variant_id: string | null;

  @ManyToOne(() => Variant)
  @JoinColumn({ name: 'variant_id' })
  variant: Variant | null;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  fixed_price: string | null;
}
