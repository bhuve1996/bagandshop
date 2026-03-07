import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { VendorProductMapping } from './vendor-product-mapping.entity';
import { VendorInventory } from './vendor-inventory.entity';
import { VendorRoutingRule } from './vendor-routing-rule.entity';

@Entity('vendors')
export class VendorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'varchar', length: 32, default: 'rest' })
  api_type: string;

  @Column({ type: 'jsonb', default: {} })
  api_config: Record<string, unknown>;

  @Column({ type: 'jsonb', default: {} })
  pricing_rule: Record<string, unknown>;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => VendorProductMapping, (m) => m.vendor)
  mappings: VendorProductMapping[];

  @OneToMany(() => VendorInventory, (v) => v.vendor)
  inventory: VendorInventory[];

  @OneToMany(() => VendorRoutingRule, (r) => r.vendor)
  routing_rules: VendorRoutingRule[];
}
