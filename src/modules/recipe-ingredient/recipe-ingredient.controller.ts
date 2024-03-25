import { Controller, Get, Param, Query } from '@nestjs/common';

import { RecipeIngredientService } from './recipe-ingredient.service';
import {
  AmountType,
  QueryFilter,
  RecipeIngredient,
} from './recipe-ingredient.types';

@Controller('/api/v1/recipe-ingredients')
export class RecipeIngredientController {
  constructor(private readonly ingredientService: RecipeIngredientService) {}

  @Get()
  async getRecipeIngredients(
    @Query() filter: QueryFilter = {},
  ): Promise<RecipeIngredient[]> {
    return await this.ingredientService.getIngredients(filter);
  }

  @Get('amount-types')
  async getTypes(): Promise<AmountType[]> {
    return await this.ingredientService.getAmountTypes();
  }

  @Get(':id')
  async getRecipeIngredientById(
    @Param() id: string,
  ): Promise<RecipeIngredient> {
    return await this.ingredientService.getIngredientById(id);
  }
}
