import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { VendorEntity } from './vendor.entity';
import { Variant } from '../../products/entities/variant.entity';

@Entity('vendor_inventory')
@Unique(['vendor_id', 'variant_id'])
export class VendorInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  vendor_id: string;

  @ManyToOne(() => VendorEntity, (v) => v.inventory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: VendorEntity;

  @Column({ type: 'uuid' })
  variant_id: string;

  @ManyToOne(() => Variant)
  @JoinColumn({ name: 'variant_id' })
  variant: Variant;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  reserved: number;

  @UpdateDateColumn()
  updated_at: Date;
}
