import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VendorEntity } from './vendor.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('vendor_product_mapping')
export class VendorProductMapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  vendor_id: string;

  @ManyToOne(() => VendorEntity, (v) => v.mappings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: VendorEntity;

  @Column({ type: 'uuid' })
  product_id: string;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column()
  vendor_sku: string;

  @Column({ type: 'jsonb', default: {} })
  vendor_data: Record<string, unknown>;

  @Column({ type: 'timestamptz', nullable: true })
  last_synced_at: Date | null;
}
