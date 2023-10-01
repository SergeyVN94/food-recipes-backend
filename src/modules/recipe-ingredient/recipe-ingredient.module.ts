import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecipeIngredientService } from './recipe-ingredient.service';
import { RecipeIngredientController } from './recipe-ingredient.controller';
import { RecipeIngredientEntity } from './recipe-ingredient.entity';

@Module({
  providers: [RecipeIngredientService],
  controllers: [RecipeIngredientController],
  imports: [TypeOrmModule.forFeature([RecipeIngredientEntity])],
})
export class RecipeIngredientModule {}
