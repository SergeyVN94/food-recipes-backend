import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecipeIngredientModule } from '../recipe-ingredient';

import { RecipeController } from './recipe.controller';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';
import { RecipeStepEntity } from './recipe-step.entity';

@Module({
  controllers: [RecipeController],
  providers: [RecipeService],
  imports: [
    TypeOrmModule.forFeature([RecipeEntity, RecipeStepEntity]),
    RecipeIngredientModule,
  ],
})
export class RecipeModule {}
