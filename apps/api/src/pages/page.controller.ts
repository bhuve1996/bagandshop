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
import { PageService, CreatePageDto, UpdatePageDto } from './page.service';

@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  create(@Body() dto: CreatePageDto) {
    return this.pageService.create(dto);
  }

  @Get()
  findAll(@Query('template_type') templateType?: string) {
    return this.pageService.findAll(
      templateType as 'home' | 'product' | 'blog_post' | 'landing' | undefined,
    );
  }

  @Get('storefront')
  async getForStorefront(
    @Query('slug') slug?: string,
    @Query('template') template?: string,
    @Query('context_id') contextId?: string,
    @Query('preview') preview?: string,
  ) {
    const result = await this.pageService.getPageForStorefront(
      slug,
      template as 'home' | 'product' | 'blog_post' | 'landing' | undefined,
      contextId,
      preview === '1' || preview === 'true',
    );
    if (!result) return { page: null, sections: [] };
    return {
      page: {
        id: result.page.id,
        slug: result.page.slug,
        template_type: result.page.template_type,
        title: result.page.title,
        meta: result.page.meta,
        published_at: result.page.published_at?.toISOString() ?? null,
        context_id: result.page.context_id,
        created_at: result.page.created_at.toISOString(),
        updated_at: result.page.updated_at.toISOString(),
      },
      sections: result.sections.map((s) => ({
        id: s.id,
        page_id: s.page_id,
        section_type: s.section_type,
        settings: s.settings,
        sort_order: s.sort_order,
        visibility: s.visibility,
        created_at: s.created_at?.toISOString(),
        updated_at: s.updated_at?.toISOString(),
      })),
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pageService.findOneWithSections(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePageDto,
  ) {
    return this.pageService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pageService.remove(id);
  }
}
