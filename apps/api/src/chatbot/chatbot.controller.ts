import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ChatbotService, CreateChatbotKnowledgeDto, UpdateChatbotKnowledgeDto } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly service: ChatbotService) {}

  @Post('ask')
  ask(@Body() body: { question: string }) {
    return this.service.ask(body.question ?? '');
  }

  @Get('knowledge')
  listKnowledge() {
    return this.service.findAll();
  }

  @Get('knowledge/:id')
  getKnowledge(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post('knowledge')
  createKnowledge(@Body() dto: CreateChatbotKnowledgeDto) {
    return this.service.create(dto);
  }

  @Put('knowledge/:id')
  updateKnowledge(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateChatbotKnowledgeDto) {
    return this.service.update(id, dto);
  }

  @Delete('knowledge/:id')
  removeKnowledge(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
