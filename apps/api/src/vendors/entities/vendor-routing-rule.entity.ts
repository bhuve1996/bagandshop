import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VendorEntity } from './vendor.entity';

@Entity('vendor_routing_rules')
export class VendorRoutingRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  vendor_id: string;

  @ManyToOne(() => VendorEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: VendorEntity;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  /** JSONB: min_order (number), region (string or string[]), product_tag (string or string[]) */
  @Column({ type: 'jsonb', default: {} })
  conditions: Record<string, unknown>;

  @Column({ type: 'int', default: 0 })
  priority: number;
}
