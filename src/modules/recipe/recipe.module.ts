import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IngredientModule } from '../ingredient';
import { MinioClientModule } from '../minio-client';

import { RecipeController } from './recipe.controller';
import { RecipeEntity } from './entity/recipe.entity';
import { RecipeService } from './recipe.service';
import { RecipeStepEntity } from './entity/recipe-step.entity';
import { RecipeIngredientUnitEntity } from './entity/recipe-ingredient-unit.entity';

@Module({
  controllers: [RecipeController],
  providers: [RecipeService],
  imports: [
    MinioClientModule,
    TypeOrmModule.forFeature([
      RecipeEntity,
      RecipeStepEntity,
      RecipeIngredientUnitEntity,
    ]),
    IngredientModule,
  ],
})
export class RecipeModule {}
