import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Optional } from '@/modules/auth/decorators/optional.decorator';
import { Public } from '@/modules/auth/decorators/public.decorator';
import { User } from '@/modules/users/decorators/user.decorator';
import { UserAuthDto } from '@/modules/users/dto/user-auth.dto';

import { RecipesFilterDto } from './dto/filter.dto';
import { RecipeCreateDto } from './dto/recipe-create.dto';
import { RecipeUpdateDto } from './dto/recipe-update.dto';
import { RecipeEntity } from './entity/recipe.entity';
import { RecipesService } from './recipes.service';

@ApiTags('Рецепты')
@Controller('/recipes')
export class RecipesController {
  constructor(private readonly recipeService: RecipesService) {}

  @ApiBody({
    type: RecipesFilterDto,
    required: false,
  })
  @ApiResponse({ type: RecipeEntity, isArray: true })
  @HttpCode(HttpStatus.OK)
  @Optional()
  @Post('/search')
  async getRecipes(@Body() filter: RecipesFilterDto, @User() user: UserAuthDto): Promise<RecipeEntity[]> {
    return await this.recipeService.getRecipes(filter, user);
  }

  @ApiParam({ name: 'slug', type: String, required: true })
  @ApiResponse({ type: RecipeEntity })
  @Public()
  @Get('/slug/:slug')
  async getRecipeBySlug(@Param('slug') slug: string): Promise<RecipeEntity> {
    const recipe = await this.recipeService.getRecipeBySlug(slug);

    if (!recipe) {
      throw new NotFoundException();
    }

    return recipe;
  }

  @ApiParam({ name: 'slug', type: String, required: true })
  @ApiResponse({ type: RecipeEntity, status: 200 })
  @Public()
  @Get('/:id')
  async getRecipeById(@Param('id') id: string): Promise<RecipeEntity> {
    const recipe = await this.recipeService.getRecipeById(id);

    if (!recipe) {
      throw new NotFoundException();
    }

    return recipe;
  }

  @ApiResponse({ type: RecipeEntity })
  @Post()
  async saveRecipe(@Body() body: RecipeCreateDto, @User() user: UserAuthDto) {
    return await this.recipeService.saveRecipe(body, user.id);
  }

  @ApiResponse({ type: RecipeEntity })
  @Patch(':slug')
  async updateRecipe(@Body() body: RecipeUpdateDto, @Param('slug') slug: string, @User() user: UserAuthDto) {
    return await this.recipeService.updateRecipe(slug, body, user);
  }

  @ApiResponse({ type: RecipeEntity })
  @Delete(':slug')
  async deleteRecipe(@Param('slug') slug: string, @User() user: UserAuthDto) {
    return await this.recipeService.deleteRecipe(slug, user);
  }

  @ApiResponse({ type: RecipeEntity })
  @Patch(':slug/publish')
  async publishRecipe(@Param('slug') slug: string, @User() user: UserAuthDto) {
    return await this.recipeService.publishRecipe(slug, user);
  }

  @ApiResponse({ type: RecipeEntity })
  @Patch(':slug/unpublish')
  async unpublishRecipe(@Param('slug') slug: string, @User() user: UserAuthDto) {
    return await this.recipeService.unpublishRecipe(slug, user);
  }
}
