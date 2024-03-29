import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as crypto from 'crypto';

import { RecipeDto } from './recipe.dto';
import { RecipeService } from './recipe.service';
import { RecipeFilter } from './types';
import { RecipeEntity } from './recipe.entity';
import { RecipeResponse } from './recipe.types';

@Controller('/api/v1/recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @ApiQuery({ name: 'q', type: String, required: false })
  @ApiQuery({ name: 'slugs', type: String, isArray: true, required: false })
  @ApiCreatedResponse({ type: RecipeEntity, isArray: true })
  @Get()
  async getRecipes(@Query() filter: RecipeFilter): Promise<RecipeEntity[]> {
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
  @UseInterceptors(
    FilesInterceptor('images', 3, {
      limits: {
        fileSize: 5e6, // 5MB
      },
    }),
  )
  async saveRecipe(
    @Body() body: RecipeDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
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
