import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './modules/app';
import { TypeormExceptionsFilter, HttpExceptionFilter } from './filters';

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

  const config = new DocumentBuilder()
    .setTitle('Рецепты')
    .setDescription('Апи для сайта рецептов')
    .setVersion('1.0')
    .addTag('recipes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(8000);
}
bootstrap();
