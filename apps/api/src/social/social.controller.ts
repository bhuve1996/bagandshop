import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { SocialService, CreateSocialFeedConfigDto, UpdateSocialFeedConfigDto } from './social.service';

@Controller('social')
export class SocialController {
  constructor(private readonly service: SocialService) {}

  @Get('feeds')
  listFeeds(@Query('active') active?: string) {
    return this.service.findAll(active === '1' || active === 'true');
  }

  @Get('feeds/:id')
  getFeed(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post('feeds')
  createFeed(@Body() dto: CreateSocialFeedConfigDto) {
    return this.service.create(dto);
  }

  @Put('feeds/:id')
  updateFeed(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSocialFeedConfigDto) {
    return this.service.update(id, dto);
  }

  @Delete('feeds/:id')
  removeFeed(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
