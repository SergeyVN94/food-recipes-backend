import { Controller, Get, Param, Query } from '@nestjs/common';

import { SearchFilterDto } from '@/dto/search-filter.dto';
import { RecipeIngredientService } from './ingredient.service';
import { IngredientDto } from './dto/ingredient.dto';
import { AmountTypeDto } from './dto/amount-type.dto';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Ингредиенты')
@Controller('/api/v1/ingredients')
export class RecipeIngredientController {
  constructor(private readonly ingredientService: RecipeIngredientService) {}

  @ApiResponse({ type: IngredientDto, isArray: true })
  @Get()
  async getRecipeIngredients(
    @Query() filter: SearchFilterDto,
  ): Promise<IngredientDto[]> {
    return await this.ingredientService.getIngredients(filter);
  }

  @ApiResponse({ type: AmountTypeDto, isArray: true })
  @Get('amount-types')
  async getTypes(): Promise<AmountTypeDto[]> {
    return await this.ingredientService.getAmountTypes();
  }

  @ApiParam({ name: 'id' })
  @ApiResponse({ type: IngredientDto })
  @Get(':id')
  async getRecipeIngredientById(
    @Param() id: string,
  ): Promise<IngredientDto> {
    return await this.ingredientService.getIngredientById(Number(id));
  }
}
