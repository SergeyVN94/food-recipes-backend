import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';

import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        pool: true,
        host: 'connect.smtp.bz',
        port: 465,
        secure: true,
        auth: {
          user: 'info@pet-food-recipes.ru',
          pass: 'rF$f4tG543326y4whq4hq34hq3q',
        },
        defaults: {
          from: 'info@pet-food-recipes.ru',
        },
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(undefined, {
          inlineCssEnabled: true,
        }),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
