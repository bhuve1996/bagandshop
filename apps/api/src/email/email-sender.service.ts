import { Injectable } from '@nestjs/common';

/**
 * Provider-agnostic email sender. Replace with SES/SendGrid adapter via config.
 */
@Injectable()
export class EmailSenderService {
  async send(to: string, subject: string, bodyHtml: string): Promise<void> {
    // Stub: log only. Wire SES/SendGrid via env in production.
    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.log('[Email]', { to, subject, bodyLength: bodyHtml?.length });
    }
  }
}
