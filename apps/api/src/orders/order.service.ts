import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderLine } from './entities/order-line.entity';
import { OrderEvent } from './entities/order-event.entity';
import { VendorService } from '../vendors/vendor.service';
import { ProductService } from '../products/product.service';
import { OrderNotificationService } from './order-notification.service';
import { DiscountService } from '../discounts/discount.service';

export interface CheckoutItemDto {
  product_id?: string | null;
  variant_id?: string | null;
  combo_id?: string | null;
  quantity: number;
  price: string;
}

export interface CheckoutDto {
  email?: string | null;
  shipping_address: Record<string, unknown>;
  billing_address: Record<string, unknown>;
  items: CheckoutItemDto[];
  discount_code?: string | null;
}

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderLine)
    private readonly lineRepo: Repository<OrderLine>,
    @InjectRepository(OrderEvent)
    private readonly eventRepo: Repository<OrderEvent>,
    private readonly vendorService: VendorService,
    private readonly productService: ProductService,
    private readonly notificationService: OrderNotificationService,
    private readonly discountService: DiscountService,
  ) {}

  private async generateOrderNumber(): Promise<string> {
    const count = await this.orderRepo.count();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `ORD-${date}-${String(count + 1).padStart(5, '0')}`;
  }

  async createFromCheckout(dto: CheckoutDto, customerId?: string | null): Promise<OrderEntity> {
    const orderNumber = await this.generateOrderNumber();
    let subtotal = 0;
    for (const item of dto.items) {
      subtotal += parseFloat(item.price) * item.quantity;
    }
    let discountAmount = 0;
    let discountCodeId: string | null = null;
    if (dto.discount_code?.trim()) {
      const applied = await this.discountService.applyAndIncrement(subtotal, dto.discount_code);
      discountAmount = applied.discount_amount;
      discountCodeId = applied.code_id;
    }
    const total = Math.max(0, subtotal - discountAmount);
    const order = this.orderRepo.create({
      order_number: orderNumber,
      customer_id: customerId ?? null,
      status: 'pending',
      fulfillment_status: 'unfulfilled',
      vendor_id: null,
      totals: {
        subtotal: subtotal.toFixed(2),
        tax: '0.00',
        shipping: '0.00',
        discount: discountAmount.toFixed(2),
        discount_code_id: discountCodeId,
        total: total.toFixed(2),
      },
      shipping_address: dto.shipping_address ?? {},
      billing_address: dto.billing_address ?? {},
      email: dto.email ?? null,
    });
    const saved = await this.orderRepo.save(order);

    const lines: OrderLine[] = [];
    for (const item of dto.items) {
      const line = this.lineRepo.create({
        order_id: saved.id,
        product_id: item.product_id ?? null,
        variant_id: item.variant_id ?? null,
        combo_id: item.combo_id ?? null,
        quantity: item.quantity,
        price: item.price,
      });
      const savedLine = await this.lineRepo.save(line);
      lines.push(savedLine);
    }

    const orderTotal = subtotal;
    const shippingAddress = dto.shipping_address ?? {};
    for (const line of lines) {
      if (line.product_id) {
        try {
          const product = await this.productService.findOne(line.product_id);
          const vendorId = await this.vendorService.pickVendorForLine(
            line.product_id,
            orderTotal,
            shippingAddress,
            product.meta,
          );
          if (vendorId) {
            line.vendor_id = vendorId;
            await this.lineRepo.save(line);
          }
        } catch {
          // ignore missing product or routing errors
        }
      }
    }
    const lineVendorIds = lines.map((l) => l.vendor_id).filter((id): id is string => id != null);
    if (lineVendorIds.length > 0 && lineVendorIds.every((id) => id === lineVendorIds[0])) {
      saved.vendor_id = lineVendorIds[0];
      await this.orderRepo.save(saved);
    }

    await this.eventRepo.save(
      this.eventRepo.create({
        order_id: saved.id,
        type: 'placed',
        payload: { order_number: orderNumber },
        source: 'api',
      }),
    );

    const orderForNotification = await this.findOne(saved.id);
    await this.notificationService.notifyOrderEvent(orderForNotification, 'placed');
    return orderForNotification;
  }

  async findAll(limit = 50): Promise<OrderEntity[]> {
    return this.orderRepo.find({
      relations: ['lines', 'events'],
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async findMyOrders(customerId: string, limit = 50): Promise<OrderEntity[]> {
    return this.orderRepo.find({
      where: { customer_id: customerId },
      relations: ['lines', 'events'],
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async findOne(id: string): Promise<OrderEntity> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['lines', 'events'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findByOrderNumber(orderNumber: string, email?: string): Promise<OrderEntity | null> {
    const qb = this.orderRepo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.lines', 'l')
      .where('o.order_number = :orderNumber', { orderNumber });
    if (email) {
      qb.andWhere('LOWER(o.email) = LOWER(:email)', { email });
    }
    return qb.getOne();
  }

  async updateStatus(id: string, status: string, fulfillmentStatus?: string): Promise<OrderEntity> {
    const order = await this.findOne(id);
    order.status = status;
    if (fulfillmentStatus != null) order.fulfillment_status = fulfillmentStatus;
    await this.orderRepo.save(order);
    await this.eventRepo.save(
      this.eventRepo.create({
        order_id: id,
        type: 'status_updated',
        payload: { status, fulfillment_status: fulfillmentStatus },
        source: 'manual',
      }),
    );
    return this.findOne(id);
  }

  /**
   * Record a vendor update (accepted, shipped, delivered, cancelled) and update order status.
   * Called from POST /orders/vendor-update (vendor webhook/API).
   */
  async recordVendorUpdate(
    vendorId: string,
    orderNumber: string,
    event: string,
    payload?: Record<string, unknown>,
  ): Promise<OrderEntity> {
    const order = await this.orderRepo.findOne({
      where: { order_number: orderNumber },
      relations: ['lines'],
    });
    if (!order) throw new NotFoundException('Order not found');
    const vendorLinked =
      order.vendor_id === vendorId || order.lines?.some((l) => l.vendor_id === vendorId);
    if (!vendorLinked) throw new NotFoundException('Order not linked to this vendor');

    await this.eventRepo.save(
      this.eventRepo.create({
        order_id: order.id,
        type: event,
        payload: payload ?? {},
        source: 'webhook',
      }),
    );

    switch (event) {
      case 'shipped':
        order.fulfillment_status = 'shipped';
        break;
      case 'delivered':
        order.fulfillment_status = 'fulfilled';
        break;
      case 'cancelled':
        order.status = 'cancelled';
        break;
      default:
        break;
    }
    await this.orderRepo.save(order);
    const updated = await this.findOne(order.id);
    await this.notificationService.notifyOrderEvent(updated, event, payload);
    return updated;
  }
}
