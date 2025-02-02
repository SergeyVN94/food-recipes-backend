import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookmarkModule } from '@/modules/bookmark/bookmark.module';
import { IngredientModule } from '@/modules/ingredient';
import { MinioClientModule } from '@/modules/minio-client';

import { RecipeIngredientUnitEntity } from './entity/recipe-ingredient-unit.entity';
import { RecipeStepEntity } from './entity/recipe-step.entity';
import { RecipeEntity } from './entity/recipe.entity';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';

@Module({
  controllers: [RecipeController],
  providers: [RecipeService],
  imports: [
    MinioClientModule,
    TypeOrmModule.forFeature([RecipeEntity, RecipeStepEntity, RecipeIngredientUnitEntity]),
    IngredientModule,
    BookmarkModule,
  ],
})
export class RecipeModule {}
