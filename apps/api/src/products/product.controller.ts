import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductService, CreateProductDto, UpdateProductDto } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('category_id') categoryId?: string,
    @Query('status') status?: string,
  ) {
    const catId = categoryId === undefined ? undefined : categoryId === '' || categoryId === 'null' ? null : categoryId;
    return this.service.findAll(catId, status);
  }

  @Get('by-handle/:handle')
  findByHandle(@Param('handle') handle: string) {
    return this.service.findByHandle(handle);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
