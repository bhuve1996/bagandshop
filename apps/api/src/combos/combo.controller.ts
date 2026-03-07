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
import { ComboService, CreateComboDto, UpdateComboDto } from './combo.service';

@Controller('combos')
export class ComboController {
  constructor(private readonly service: ComboService) {}

  @Post()
  create(@Body() dto: CreateComboDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.service.findAll(status);
  }

  @Get('by-handle/:handle')
  findByHandle(@Param('handle') handle: string) {
    return this.service.findByHandle(handle);
  }

  @Get('inventory/:id')
  async getInventory(@Param('id', ParseUUIDPipe) id: string) {
    const available = await this.service.getComboInventory(id);
    return { available };
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateComboDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
