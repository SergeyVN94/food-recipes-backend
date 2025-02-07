import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SearchFilterDto } from '@/dto/search-filter.dto';
import { Public } from '@/modules/auth/decorators/public.decorator';

import { AmountTypeDto } from './dto/amount-type.dto';
import { IngredientDto } from './dto/ingredient.dto';
import { RecipeIngredientService } from './ingredient.service';

@ApiTags('Ингредиенты')
@Controller('/ingredients')
export class RecipeIngredientController {
  constructor(private readonly ingredientService: RecipeIngredientService) {}

  @ApiResponse({ type: IngredientDto, isArray: true })
  @Public()
  @UseInterceptors(CacheInterceptor)
  @Get()
  async getRecipeIngredients(@Query() filter: SearchFilterDto): Promise<IngredientDto[]> {
    return await this.ingredientService.getIngredients(filter);
  }

  @ApiResponse({ type: AmountTypeDto, isArray: true })
  @Public()
  @UseInterceptors(CacheInterceptor)
  @Get('amount-types')
  async getTypes(): Promise<AmountTypeDto[]> {
    return await this.ingredientService.getAmountTypes();
  }

  @ApiParam({ name: 'id' })
  @ApiResponse({ type: IngredientDto })
  @Public()
  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  async getRecipeIngredientById(@Param() id: string): Promise<IngredientDto> {
    return await this.ingredientService.getIngredientById(Number(id));
  }
}
