import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RecipeDto } from './recipe.dto';

import { ApiCreatedResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

import { RecipeService } from './recipe.service';
import { RecipeFilter } from './types';
import { RecipeEntity } from './recipe.entity';

@Controller('/api/v1/recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @ApiQuery({ name: 'query', type: String, required: false })
  @ApiQuery({ name: 'slugs', type: String, isArray: true, required: false })
  @ApiCreatedResponse({ type: RecipeEntity, isArray: true })
  @Get()
  async getRecipes(@Query() filter: RecipeFilter): Promise<RecipeEntity[]> {
    return await this.recipeService.getRecipes(filter);
  }

  @ApiParam({ name: 'slug', type: String, required: true })
  @ApiCreatedResponse({ type: RecipeEntity })
  @Get(':slug')
  async getRecipeBySlug(@Param('slug') slug: string): Promise<RecipeEntity> {
    const recipe = await this.recipeService.getRecipeBySlug(slug);

    if (!recipe) {
      throw new NotFoundException();
    }

    return recipe;
  }

  @Post()
  saveRecipe(@Body() body: RecipeDto) {
    console.log('saveRecipe', body);
    
    return JSON.stringify(body);
  }

  @Put(':slug')
  updateRecipe(@Body() body: RecipeDto, @Param('slug') slug: string) {
    return JSON.stringify(body);
  }

  @Delete(':slug')
  deleteRecipe(@Param('slug') slug: string) {
    return slug;
  }
}
