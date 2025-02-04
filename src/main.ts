import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { Logger } from 'nestjs-pino';

import { HttpExceptionFilter, TypeormExceptionsFilter } from '@/filters';
import { AppModule } from '@/modules/app/app.module';

import { JwtAuthGuard } from './modules/auth/guards/jwt.guard';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      credentials: true,
    },
    bodyParser: true,
  });

  const validationPipe = new ValidationPipe({
    transform: true,
    exceptionFactory: errors =>
      new BadRequestException(
        errors
          .map(error => Object.values(error.constraints))
          .flat(1)
          .join(','),
      ),
  });
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  const logger = app.get(Logger);

  app.useGlobalPipes(validationPipe);
  app.useGlobalFilters(new TypeormExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalGuards(new JwtAuthGuard(jwtService, reflector));
  app.useLogger(logger);
  app.setGlobalPrefix('/api/v1');

  const config = new DocumentBuilder().setTitle('Рецепты').setDescription('Апи для сайта рецептов').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT ?? 8000, process.env.HOST ?? '0.0.0.0', () => {
    console.log(`Server started on port ${process.env.PORT ?? 8000}`);
  });

  const isProduction = process.env.NODE_ENV === 'production';

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!isProduction && module.hot) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    module.hot.accept();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    module.hot.dispose(() => app.close());
  }
}

void bootstrap();
