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
  SectionService,
  CreateSectionDto,
  UpdateSectionDto,
  ReorderSectionsDto,
} from './section.service';

@Controller('sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get('types')
  getTypes(@Query('template') template?: string) {
    return this.sectionService.getSectionTypes(
      template as 'home' | 'product' | 'blog_post' | 'landing' | undefined,
    );
  }

  @Get('types/:typeId')
  getType(@Param('typeId') typeId: string) {
    const def = this.sectionService.getSectionType(typeId);
    if (!def) return {};
    return def;
  }

  @Post()
  create(@Body() dto: CreateSectionDto) {
    return this.sectionService.create(dto);
  }

  @Get('page/:pageId')
  findByPage(@Param('pageId', ParseUUIDPipe) pageId: string) {
    return this.sectionService.findByPageId(pageId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectionService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.sectionService.update(id, dto);
  }

  @Put('page/:pageId/reorder')
  reorder(
    @Param('pageId', ParseUUIDPipe) pageId: string,
    @Body() dto: ReorderSectionsDto,
  ) {
    return this.sectionService.reorder(pageId, dto.section_ids);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectionService.remove(id);
  }
}
