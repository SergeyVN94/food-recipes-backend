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
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { RecipeCreateDto } from './dto/recipe-create.dto';
import { RecipeService } from './recipe.service';
import { RecipesFilterDto } from './dto/filter.dto';
import { RecipeDto } from './dto/recipe.dto';
import { JwtAuthGuard } from '../auth';

@ApiTags('Рецепты')
@Controller('/api/v1/recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @ApiBody({
    type: RecipesFilterDto,
    required: false,
  })
  @ApiResponse({ type: RecipeDto, isArray: true })
  @Post('/search')
  @HttpCode(200)
  async getRecipes(@Body() filter: RecipesFilterDto, @Req() req): Promise<RecipeDto[]> {
    return await this.recipeService.getRecipes(filter, req.user);
  }

  @ApiParam({ name: 'slug', type: String, required: true })
  @ApiResponse({ type: RecipeDto })
  @Get(':slug')
  async getRecipeBySlug(@Param('slug') slug: string): Promise<RecipeDto> {
    const recipe = await this.recipeService.getRecipeBySlug(slug);

    if (!recipe) {
      throw new NotFoundException();
    }

    return recipe;
  }

  @ApiResponse({ type: RecipeDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 3))
  async saveRecipe(
    @Body() body: RecipeCreateDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5e6 })
        .addFileTypeValidator({ fileType: /\/(png|jpg|jpeg)$/ })
        .build({
          fileIsRequired: false,
        }),
    )
    files: Express.Multer.File[] = [],
    @Req() req,
  ) {
    const newRecipe = await this.recipeService.saveRecipe(body, files, req.user.userId);

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
