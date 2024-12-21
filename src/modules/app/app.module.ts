import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { RecipeModule } from '@/modules/recipe';
import { RecipeIngredientModule } from '@/modules/ingredient';
import { AuthModule } from '@/modules/auth';
import dataSourceOptions from '@/config/data-source-options';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local'],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: process.env.NODE_ENV === 'production' ? undefined : { target: 'pino-pretty' },
      },
    }),
    AuthModule,
    UserModule,
    RecipeModule,
    RecipeIngredientModule,
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
