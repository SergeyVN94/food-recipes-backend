import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Optional } from '@/modules/auth/decorators/optional.decorator';
import { Public } from '@/modules/auth/decorators/public.decorator';
import { User } from '@/modules/user/decorators/user.decorator';
import { UserAuthDto } from '@/modules/user/dto/user-auth.dto';

import { RecipesFilterDto } from './dto/filter.dto';
import { RecipeCreateDto } from './dto/recipe-create.dto';
import { RecipeUpdateDto } from './dto/recipe-update.dto';
import { RecipeDto } from './dto/recipe.dto';
import { RecipeService } from './recipe.service';

@ApiTags('Рецепты')
@Controller('/recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @ApiBody({
    type: RecipesFilterDto,
    required: false,
  })
  @ApiResponse({ type: RecipeDto, isArray: true })
  @Optional()
  @Post('/search')
  async getRecipes(@Body() filter: RecipesFilterDto, @User() user: UserAuthDto): Promise<RecipeDto[]> {
    return await this.recipeService.getRecipes(filter, user);
  }

  @ApiParam({ name: 'slug', type: String, required: true })
  @ApiResponse({ type: RecipeDto })
  @Public()
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
  @Public()
  @Get('/:id')
  async getRecipeById(@Param('id') id: string): Promise<RecipeDto> {
    const recipe = await this.recipeService.getRecipeById(id);

    if (!recipe) {
      throw new NotFoundException();
    }

    return recipe;
  }

  @ApiResponse({ type: RecipeDto })
  @Post()
  async saveRecipe(@Body() body: RecipeCreateDto, @User() user: UserAuthDto) {
    const newRecipe = await this.recipeService.saveRecipe(body, user.id);

    return newRecipe;
  }

  @ApiResponse({ type: RecipeDto })
  @Patch(':slug')
  async updateRecipe(@Body() body: RecipeUpdateDto, @Param('slug') slug: string, @User() user: UserAuthDto) {
    return await this.recipeService.updateRecipe(slug, body, user);
  }

  @ApiResponse({ type: RecipeDto })
  @Delete(':slug')
  async deleteRecipe(@Param('slug') slug: string, @User() user: UserAuthDto) {
    return await this.recipeService.deleteRecipe(slug, user);
  }
}
