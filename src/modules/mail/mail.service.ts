import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Подтверждение регистрации',
      from: `${process.env.MAIL_FROM_HOST} <no-reply@${process.env.MAIL_FROM_HOST}>`,
      context: {
        url: `${process.env.CLIENT_URL}${process.env.CONFIRMATION_PATH}?token=${token}`,
        name: new URL(process.env.CLIENT_URL).hostname,
      },
      template: 'confirmation.hbs',
    });
  }
}
