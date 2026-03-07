import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post()
  create(@Body() dto: { name: string; slug: string; parent_id?: string | null; sort_order?: number; meta?: Record<string, unknown> }) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('parent_id') parentId?: string) {
    if (parentId === undefined) return this.service.findAll();
    if (parentId === '' || parentId === 'null') return this.service.findAll(null);
    return this.service.findAll(parentId);
  }

  @Get('by-slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Record<string, unknown>) {
    return this.service.update(id, dto as Parameters<CategoryService['update']>[1]);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
