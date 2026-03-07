import { Controller, Get, Put, Body, Query } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('site-config')
  async getSiteConfig(@Query('locale') locale?: string) {
    return this.contentService.getSiteConfig(locale ?? 'default');
  }

  @Get()
  async getAll(@Query('locale') locale?: string) {
    return this.contentService.getAll(locale ?? 'default');
  }

  @Get('key')
  async get(
    @Query('key') key: string,
    @Query('locale') locale?: string,
  ) {
    return this.contentService.get(key, locale ?? 'default');
  }

  @Put()
  async set(
    @Body() body: { key: string; value: string; locale?: string },
  ) {
    return this.contentService.set(
      body.key,
      body.value,
      body.locale ?? 'default',
    );
  }
}
