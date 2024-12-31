import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecipeIngredientService } from './ingredient.service';
import { RecipeIngredientController } from './ingredient.controller';
import { IngredientEntity } from './entity/ingredient.entity';
import { AmountTypeEntity } from './entity/amount-types.entity';

@Module({
  providers: [RecipeIngredientService],
  controllers: [RecipeIngredientController],
  imports: [TypeOrmModule.forFeature([IngredientEntity, AmountTypeEntity])],
})
export class IngredientModule {}
