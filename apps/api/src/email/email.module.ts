import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplateEntity } from './entities/email-template.entity';
import { EmailWorkflowEntity } from './entities/email-workflow.entity';
import { EmailTemplateService } from './email-template.service';
import { EmailWorkflowService } from './email-workflow.service';
import { EmailSenderService } from './email-sender.service';
import { EmailController } from './email.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailTemplateEntity, EmailWorkflowEntity]),
  ],
  controllers: [EmailController],
  providers: [EmailTemplateService, EmailWorkflowService, EmailSenderService],
  exports: [EmailTemplateService, EmailWorkflowService, EmailSenderService],
})
export class EmailModule {}
