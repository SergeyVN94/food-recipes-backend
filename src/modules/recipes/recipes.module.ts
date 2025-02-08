import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookmarksModule } from '@/modules/bookmarks/bookmarks.module';
import { IngredientsModule } from '@/modules/ingredients';
import { MinioClientModule } from '@/modules/minio-client';

import { RecipeIngredientUnitEntity } from './entity/recipe-ingredient-unit.entity';
import { RecipeStepEntity } from './entity/recipe-step.entity';
import { RecipeEntity } from './entity/recipe.entity';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService],
  imports: [
    MinioClientModule,
    TypeOrmModule.forFeature([RecipeEntity, RecipeStepEntity, RecipeIngredientUnitEntity]),
    IngredientsModule,
    forwardRef(() => BookmarksModule),
  ],
})
export class RecipesModule {}
