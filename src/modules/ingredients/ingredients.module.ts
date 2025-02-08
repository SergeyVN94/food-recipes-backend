import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AmountTypeEntity } from './entity/amount-types.entity';
import { IngredientEntity } from './entity/ingredient.entity';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';

@Module({
  providers: [IngredientsService],
  controllers: [IngredientsController],
  imports: [TypeOrmModule.forFeature([IngredientEntity, AmountTypeEntity])],
})
export class IngredientsModule {}
