import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AmountTypeEntity } from './entity/amount-types.entity';
import { IngredientEntity } from './entity/ingredient.entity';
import { RecipeIngredientController } from './ingredient.controller';
import { RecipeIngredientService } from './ingredient.service';

@Module({
  providers: [RecipeIngredientService],
  controllers: [RecipeIngredientController],
  imports: [TypeOrmModule.forFeature([IngredientEntity, AmountTypeEntity])],
})
export class IngredientModule {}
