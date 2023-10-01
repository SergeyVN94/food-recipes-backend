import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RecipeDto } from './recipe.dto';

import { RecipeService } from './recipe.service';
import { Recipe } from './types';

@Controller('/api/v1/recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async getRecipes(
    @Query() filter: { query?: string; slugs?: string[] }
  ): Promise<Recipe[]> {
    return await this.recipeService.getRecipes(filter);
  }

  @Post()
  saveRecipe(@Body() body: RecipeDto) {
    return JSON.stringify(body);
  }

  @Put(':id')
  updateRecipe(@Body() body: RecipeDto, @Param('id') id: string) {
    return JSON.stringify(body);
  }

  @Delete(':id')
  deleteRecipe(@Param('id') id: string) {
    return id;
  }
}
