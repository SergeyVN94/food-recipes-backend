import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { RecipeModule } from '@/modules/recipe';
import { RecipeIngredientModule } from '@/modules/recipe-ingredient';
import { AuthModule } from '@/modules/auth';
import dataSourceOptions from '@/config/data-source-options';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local'],
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
