import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RecipeCreateDto } from './dto/recipe-create.dto';
import { RecipeService } from './recipe.service';
import { RecipesFilterDto } from './dto/filter.dto';
import { RecipeDto } from './dto/recipe.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RecipeUpdateDto } from './dto/recipe-update.dto';

@ApiTags('Рецепты')
@Controller('/recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @ApiBody({
    type: RecipesFilterDto,
    required: false,
  })
  @ApiResponse({ type: RecipeDto, isArray: true })
  @Post('/search')
  @HttpCode(200)
  async getRecipes(
    @Body() filter: RecipesFilterDto,
    @Req() req,
  ): Promise<RecipeDto[]> {
    return await this.recipeService.getRecipes(filter, req.user);
  }

  @ApiParam({ name: 'slug', type: String, required: true })
  @ApiResponse({ type: RecipeDto })
  @Get('/slug/:slug')
  async getRecipeBySlug(@Param('slug') slug: string): Promise<RecipeDto> {
    const recipe = await this.recipeService.getRecipeBySlug(slug);

    if (!recipe) {
      throw new NotFoundException();
    }

    return recipe;
  }

  @ApiParam({ name: 'slug', type: String, required: true })
  @ApiResponse({ type: RecipeDto })
  @Get('/:id')
  async getRecipeById(@Param('id') id: string): Promise<RecipeDto> {
    const recipe = await this.recipeService.getRecipeById(id);

    if (!recipe) {
      throw new NotFoundException();
    }

    return recipe;
  }

  @ApiResponse({ type: RecipeDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  async saveRecipe(@Body() body: RecipeCreateDto, @Req() req) {
    const newRecipe = await this.recipeService.saveRecipe(
      body,
      req.user.userId,
    );

    return newRecipe;
  }

  @ApiResponse({ type: RecipeDto })
  @UseGuards(JwtAuthGuard)
  @Patch(':slug')
  async updateRecipe(
    @Body() body: RecipeUpdateDto,
    @Param('slug') slug: string,
    @Req() req,
  ) {
    return await this.recipeService.updateRecipe(slug, body, req.user);
  }

  @ApiResponse({ type: RecipeDto })
  @UseGuards(JwtAuthGuard)
  @Delete(':slug')
  async deleteRecipe(@Param('slug') slug: string, @Req() req) {
    return await this.recipeService.deleteRecipe(slug, req.user);
  }
}
