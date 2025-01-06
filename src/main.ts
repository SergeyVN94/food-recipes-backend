import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

import { TypeormExceptionsFilter, HttpExceptionFilter } from './filters';
import { Logger } from 'nestjs-pino';
import { AppModule } from './modules/app/app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      credentials: true,
    },
    bodyParser: true,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new TypeormExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('/api/v1');

  const config = new DocumentBuilder()
    .setTitle('Рецепты')
    .setDescription('Апи для сайта рецептов')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('swagger', app, document);

  await app.listen(
    process.env.PORT ?? 8000,
    process.env.HOST ?? '0.0.0.0',
    () => {
      console.log(`Server started on port ${process.env.PORT ?? 8000}`);
    },
  );

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction && module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
