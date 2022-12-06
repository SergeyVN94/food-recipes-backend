import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3100',
      credentials: true,
    },
    bodyParser: true,
  });
  await app.listen(8000);
}
bootstrap();
