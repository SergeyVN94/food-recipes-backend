import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { RecipeDto } from './dto/recipe.dto';
import { RecipeService } from './recipe.service';
import { RecipeEntity } from './entity/recipe.entity';
import { RecipeResponse } from './recipe.types';
import { RecipesFilterDto } from './dto/filter.dto';

@Controller('/api/v1/recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @ApiQuery({ name: 'q', type: String, required: false })
  @ApiQuery({ name: 'slugs', type: String, isArray: true, required: false })
  @ApiQuery({
    name: 'ingredients',
    type: String,
    isArray: true,
    required: false,
  })
  @ApiCreatedResponse({ type: RecipeEntity, isArray: true })
  @Post('/search')
  @HttpCode(200)
  async getRecipes(@Body() filter: RecipesFilterDto): Promise<RecipeEntity[]> {
    return await this.recipeService.getRecipes(filter);
  }

  @ApiParam({ name: 'slug', type: String, required: true })
  @ApiCreatedResponse({ type: RecipeEntity })
  @Get(':slug')
  async getRecipeBySlug(@Param('slug') slug: string): Promise<RecipeResponse> {
    const recipe = await this.recipeService.getRecipeBySlug(slug);

    if (!recipe) {
      throw new NotFoundException();
    }

    return recipe;
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 3))
  async saveRecipe(
    @Body() body: RecipeDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5e6 })
        .addFileTypeValidator({ fileType: /\/(png|jpg|jpeg)$/ })
        .build({
          fileIsRequired: false,
        }),
    )
    files: Express.Multer.File[] = [],
  ) {
    const newRecipe = await this.recipeService.saveRecipe(body, files);

    return newRecipe;
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
