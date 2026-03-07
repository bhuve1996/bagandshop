import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe } from '@nestjs/common';
import { EmailTemplateService, CreateEmailTemplateDto, UpdateEmailTemplateDto } from './email-template.service';
import { EmailWorkflowService, CreateEmailWorkflowDto, UpdateEmailWorkflowDto } from './email-workflow.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly templateService: EmailTemplateService,
    private readonly workflowService: EmailWorkflowService,
  ) {}

  @Get('templates')
  listTemplates() {
    return this.templateService.findAll();
  }

  @Get('templates/:id')
  getTemplate(@Param('id', ParseUUIDPipe) id: string) {
    return this.templateService.findOne(id);
  }

  @Post('templates')
  createTemplate(@Body() dto: CreateEmailTemplateDto) {
    return this.templateService.create(dto);
  }

  @Put('templates/:id')
  updateTemplate(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEmailTemplateDto) {
    return this.templateService.update(id, dto);
  }

  @Delete('templates/:id')
  deleteTemplate(@Param('id', ParseUUIDPipe) id: string) {
    return this.templateService.remove(id);
  }

  @Get('workflows')
  listWorkflows() {
    return this.workflowService.findAll();
  }

  @Get('workflows/:id')
  getWorkflow(@Param('id', ParseUUIDPipe) id: string) {
    return this.workflowService.findOne(id);
  }

  @Post('workflows')
  createWorkflow(@Body() dto: CreateEmailWorkflowDto) {
    return this.workflowService.create(dto);
  }

  @Put('workflows/:id')
  updateWorkflow(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEmailWorkflowDto) {
    return this.workflowService.update(id, dto);
  }

  @Delete('workflows/:id')
  deleteWorkflow(@Param('id', ParseUUIDPipe) id: string) {
    return this.workflowService.remove(id);
  }
}
