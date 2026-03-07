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
import {
  VendorService,
  CreateVendorDto,
  UpdateVendorDto,
  CreateMappingDto,
  CreateRoutingRuleDto,
  UpdateRoutingRuleDto,
} from './vendor.service';

@Controller('vendors')
export class VendorController {
  constructor(private readonly service: VendorService) {}

  @Post()
  create(@Body() dto: CreateVendorDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('active') active?: string) {
    return this.service.findAll(active === '1' || active === 'true');
  }

  @Post('mappings')
  addMapping(@Body() dto: CreateMappingDto) {
    return this.service.addMapping(dto);
  }

  @Delete('mappings/:mappingId')
  removeMapping(@Param('mappingId', ParseUUIDPipe) mappingId: string) {
    return this.service.removeMapping(mappingId);
  }

  @Get(':id/mappings')
  getMappings(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getMappings(id);
  }

  @Get(':id/inventory')
  getInventory(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getInventory(id);
  }

  @Put(':id/inventory')
  async setInventory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { variant_id: string; quantity: number; reserved?: number },
  ) {
    return this.service.setVendorInventory(
      id,
      body.variant_id,
      body.quantity,
      body.reserved ?? 0,
    );
  }

  @Post(':id/sync')
  sync(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body?: { inventory?: Array<{ variant_id: string; quantity: number }> },
  ) {
    return this.service.sync(id, body?.inventory);
  }

  @Get(':id/routing-rules')
  getRoutingRules(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.listRoutingRules(id);
  }

  @Post(':id/routing-rules')
  createRoutingRule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateRoutingRuleDto,
  ) {
    return this.service.createRoutingRule(id, dto);
  }

  @Put(':id/routing-rules/:ruleId')
  updateRoutingRule(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('ruleId', ParseUUIDPipe) ruleId: string,
    @Body() dto: UpdateRoutingRuleDto,
  ) {
    return this.service.updateRoutingRule(ruleId, dto);
  }

  @Delete(':id/routing-rules/:ruleId')
  deleteRoutingRule(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('ruleId', ParseUUIDPipe) ruleId: string,
  ) {
    return this.service.deleteRoutingRule(ruleId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOneWithRelations(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateVendorDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
