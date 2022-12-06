import { Controller, Get, Param, Query } from '@nestjs/common';

import { RecipeService } from './recipe.service';

@Controller('/api/v1/recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  getRecipes(@Query() filter: { query?: string; slugs?: string[] }) {
    console.log(filter);
    return this.recipeService.getRecipes(filter);
  }

  @Get(':slug')
  getRecipe(@Param('slug') slug: string) {
    console.log(slug);
    return this.recipeService.getRecipes({ slugs: [slug] });
  }
}
