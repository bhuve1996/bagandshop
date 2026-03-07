import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { OrderService, CheckoutDto } from './order.service';
import { AuthGuard, OptionalAuthGuard } from '../users/auth.guard';
import { CurrentUser } from '../users/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post('checkout')
  @UseGuards(OptionalAuthGuard)
  checkout(@Body() dto: CheckoutDto, @CurrentUser() user?: UserEntity) {
    return this.service.createFromCheckout(dto, user?.id);
  }

  @Post('vendor-update')
  vendorUpdate(
    @Body() body: { vendor_id: string; order_number: string; event: string; payload?: Record<string, unknown> },
  ) {
    return this.service.recordVendorUpdate(
      body.vendor_id,
      body.order_number,
      body.event,
      body.payload,
    );
  }

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.service.findAll(limit ? parseInt(limit, 10) : 50);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  myOrders(@CurrentUser() user: UserEntity, @Query('limit') limit?: string) {
    return this.service.findMyOrders(user.id, limit ? parseInt(limit, 10) : 50);
  }

  @Get('by-number/:orderNumber')
  findByNumber(
    @Param('orderNumber') orderNumber: string,
    @Query('email') email?: string,
  ) {
    return this.service.findByOrderNumber(orderNumber, email);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: string; fulfillment_status?: string },
  ) {
    return this.service.updateStatus(id, body.status, body.fulfillment_status);
  }
}
