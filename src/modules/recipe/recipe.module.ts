import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecipeIngredientModule } from '../recipe-ingredient';

import { RecipeController } from './recipe.controller';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';

@Module({
  controllers: [RecipeController],
  providers: [RecipeService],
  imports: [TypeOrmModule.forFeature([RecipeEntity]), RecipeIngredientModule],
})
export class RecipeModule {}
