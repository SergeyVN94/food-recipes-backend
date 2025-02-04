import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import dataSourceOptions from '@/config/data-source-options';
import { AuthModule } from '@/modules/auth/auth.module';
import { RecipeModule } from '@/modules/recipe';

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
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    RecipeModule,
  ],
})
export class AppModule {}
