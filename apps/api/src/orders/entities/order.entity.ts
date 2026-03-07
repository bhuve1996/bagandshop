import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderLine } from './order-line.entity';
import { OrderEvent } from './order-event.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  order_number: string;

  @Column({ type: 'uuid', nullable: true })
  customer_id: string | null;

  @Column({ type: 'varchar', length: 64, default: 'pending' })
  status: string;

  @Column({ type: 'varchar', length: 64, default: 'unfulfilled' })
  fulfillment_status: string;

  @Column({ type: 'uuid', nullable: true })
  vendor_id: string | null;

  @Column({ type: 'jsonb', default: {} })
  totals: Record<string, unknown>;

  @Column({ type: 'jsonb', default: {} })
  shipping_address: Record<string, unknown>;

  @Column({ type: 'jsonb', default: {} })
  billing_address: Record<string, unknown>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => OrderLine, (l) => l.order)
  lines: OrderLine[];

  @OneToMany(() => OrderEvent, (e) => e.order)
  events: OrderEvent[];
}
