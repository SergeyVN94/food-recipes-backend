import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from '@/modules/auth/auth.module';
import { RecipesModule } from '@/modules/recipes';

import { EnvVariables } from './types';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local'],
      isGlobal: true,
      validationSchema: Joi.object<EnvVariables>({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(8000),
        HOST: Joi.string().hostname().default('0.0.0.0'),
        APP_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_LIFETIME: Joi.string()
          .regex(/^[0-9]+(d|h|m|s)$/)
          .default('30m'),
        JWT_REFRESH_LIFETIME: Joi.string()
          .regex(/^[0-9]+(d|h|m|s)$/)
          .default('7d'),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().default(5432),
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_FROM_HOST: Joi.string().hostname().required(),
        MAIL_CONFIRMATION_PATH: Joi.string()
          .regex(/^[a-z0-9/-]+$/i)
          .required(),
      }),
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get<string>('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            transport: isProduction ? undefined : { target: 'pino-pretty' },
          },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        synchronize: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST'),
        port: config.get<number>('POSTGRES_PORT'),
        database: config.get<string>('POSTGRES_DB'),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
      }),
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    AuthModule,
    RecipesModule,
  ],
})
export class AppModule {}
