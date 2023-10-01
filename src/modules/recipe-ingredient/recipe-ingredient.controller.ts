import { Controller, Get, Param, Query } from '@nestjs/common';

import { RecipeIngredientService } from './recipe-ingredient.service';
import { AmountType, QueryFilter, RecipeIngredient } from './types';

@Controller('/api/v1/recipe-ingredient')
export class RecipeIngredientController {
  constructor(private readonly ingredientService: RecipeIngredientService) {}

  @Get(':id')
  async get(@Param() id: string): Promise<{ results: RecipeIngredient | null }> {
    return {
      results: await this.ingredientService.getIngredientsById(parseInt(String(id), 10)),
    };
  }

  @Get()
  async getByFilter(
    @Query() filter: QueryFilter = {}
  ): Promise<{ results: RecipeIngredient[] }> {
    return {
      results: await this.ingredientService.getIngredients(filter),
    };
  }

  @Get('amount-types')
  async getAmountTypes(): Promise<{ results: AmountType[] }> {
    return {
      results: this.ingredientService.getAmountTypes(),
    };
  }
}
