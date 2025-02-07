import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendUserConfirmation(email: string, token: string) {
    const mailFrom = this.configService.get<string>('MAIL_FROM_HOST');
    const clientUrl = this.configService.get<string>('APP_URL');
    const conformationPath = this.configService.get<string>('MAIL_CONFIRMATION_PATH');

    await this.mailerService.sendMail({
      to: email,
      subject: 'Подтверждение регистрации',
      from: `${mailFrom} <no-reply@${mailFrom}>`,
      context: {
        url: `${clientUrl}${conformationPath}?token=${token}`,
        name: new URL(clientUrl).hostname,
      },
      template: 'confirmation.hbs',
    });
  }
}
