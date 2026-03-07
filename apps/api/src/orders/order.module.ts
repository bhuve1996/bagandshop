import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderLine } from './entities/order-line.entity';
import { OrderEvent } from './entities/order-event.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderNotificationService } from './order-notification.service';
import { VendorModule } from '../vendors/vendor.module';
import { ProductModule } from '../products/product.module';
import { UsersModule } from '../users/users.module';
import { DiscountModule } from '../discounts/discount.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderLine, OrderEvent]),
    VendorModule,
    ProductModule,
    UsersModule,
    DiscountModule,
    EmailModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderNotificationService],
  exports: [OrderService],
})
export class OrderModule {}
