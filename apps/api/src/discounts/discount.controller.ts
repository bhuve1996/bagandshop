import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe } from '@nestjs/common';
import { DiscountService, CreateDiscountCodeDto, UpdateDiscountCodeDto } from './discount.service';

@Controller('discounts')
export class DiscountController {
  constructor(private readonly service: DiscountService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDiscountCodeDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDiscountCodeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }

  @Post('validate')
  validate(@Body() body: { subtotal: number; code: string }) {
    return this.service.validateCode(body.subtotal ?? 0, body.code ?? '');
  }
}
