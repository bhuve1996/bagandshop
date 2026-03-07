import { Injectable } from '@nestjs/common';
import { OrderEntity } from './entities/order.entity';
import { EmailWorkflowService } from '../email/email-workflow.service';
import { EmailTemplateService } from '../email/email-template.service';
import { EmailSenderService } from '../email/email-sender.service';

@Injectable()
export class OrderNotificationService {
  constructor(
    private readonly workflowService: EmailWorkflowService,
    private readonly templateService: EmailTemplateService,
    private readonly senderService: EmailSenderService,
  ) {}

  async notifyOrderEvent(
    order: OrderEntity,
    eventType: string,
    _payload?: Record<string, unknown>,
  ): Promise<void> {
    const to = order.email;
    if (!to) return;

    const workflows = await this.workflowService.findByTrigger(eventType);
    const totals = (order.totals ?? {}) as Record<string, string>;
    const variables: Record<string, string> = {
      order_number: order.order_number,
      email: to,
      total: totals.total ?? '0',
      subtotal: totals.subtotal ?? '0',
      discount: totals.discount ?? '0',
    };

    for (const w of workflows) {
      if (!w.template) continue;
      const { subject, bodyHtml } = this.templateService.render(w.template, variables);
      await this.senderService.send(to, subject, bodyHtml);
    }
  }
}
