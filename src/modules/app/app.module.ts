import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { RecipeModule } from 'src/modules/recipe';
import { RecipeIngredientModule } from 'src/modules/recipe-ingredient';
// import { FavoritesModule } from 'src/modules/favorites';
import { AuthModule } from 'src/modules/auth';
import dataSourceOptions from 'src/db/data-source-options';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local'],
    }),
    AuthModule,
    RecipeModule,
    RecipeIngredientModule,
    // FavoritesModule,
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
