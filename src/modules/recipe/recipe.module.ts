import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecipeIngredientModule } from '../recipe-ingredient';

import { RecipeController } from './recipe.controller';
import { RecipeEntity } from './entity/recipe.entity';
import { RecipeService } from './recipe.service';
import { RecipeStepEntity } from './entity/recipe-step.entity';
import { RecipeIngredientUnitEntity } from './entity/recipe-ingredient-unit.entity';
import { MinioClientModule } from '../minio-client';

@Module({
  controllers: [RecipeController],
  providers: [RecipeService],
  imports: [
    MinioClientModule,
    TypeOrmModule.forFeature([RecipeEntity, RecipeStepEntity, RecipeIngredientUnitEntity]),
    RecipeIngredientModule,
  ],
})
export class RecipeModule {}
