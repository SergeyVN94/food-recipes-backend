import { Controller, Get, Param, Query } from '@nestjs/common';

import { SearchFilterDto } from '@/dto/search-filter.dto';
import { RecipeIngredientService } from './recipe-ingredient.service';
import { RecipeIngredientDto } from './dto/recipe-ingredient.dto';
import { AmountTypeDto } from './dto/amount-type.dto';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Ингредиенты')
@Controller('/api/v1/recipe-ingredients')
export class RecipeIngredientController {
  constructor(private readonly ingredientService: RecipeIngredientService) {}

  @ApiResponse({ type: RecipeIngredientDto, isArray: true })
  @Get()
  async getRecipeIngredients(
    @Query() filter: SearchFilterDto,
  ): Promise<RecipeIngredientDto[]> {
    return await this.ingredientService.getIngredients(filter);
  }

  @ApiResponse({ type: AmountTypeDto, isArray: true })
  @Get('amount-types')
  async getTypes(): Promise<AmountTypeDto[]> {
    return await this.ingredientService.getAmountTypes();
  }

  @ApiParam({ name: 'id' })
  @ApiResponse({ type: RecipeIngredientDto })
  @Get(':id')
  async getRecipeIngredientById(
    @Param() id: string,
  ): Promise<RecipeIngredientDto> {
    return await this.ingredientService.getIngredientById(Number(id));
  }
}
