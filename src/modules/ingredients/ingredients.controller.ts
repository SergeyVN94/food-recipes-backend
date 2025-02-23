import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SearchFilterDto } from '@/dto/search-filter.dto';
import { Public } from '@/modules/auth/decorators/public.decorator';

import { AmountTypeDto } from './dto/amount-type.dto';
import { IngredientEntity } from './entity/ingredient.entity';
import { IngredientsService } from './ingredients.service';

@UseInterceptors(CacheInterceptor)
@CacheTTL(0)
@ApiTags('Ингредиенты')
@Controller('/ingredients')
export class IngredientsController {
  constructor(private readonly ingredientService: IngredientsService) {}

  @ApiResponse({ type: IngredientEntity, isArray: true })
  @CacheKey('ingredients')
  @Public()
  @Get()
  async getRecipeIngredients(@Query() filter: SearchFilterDto) {
    return await this.ingredientService.getIngredients(filter);
  }

  @ApiResponse({ type: AmountTypeDto, isArray: true })
  @CacheKey('amount-types')
  @Public()
  @Get('amount-types')
  async getTypes(): Promise<AmountTypeDto[]> {
    return await this.ingredientService.getAmountTypes();
  }

  @ApiResponse({ type: IngredientEntity })
  @Public()
  @ApiParam({ name: 'id' })
  @Get(':id')
  async getRecipeIngredientById(@Param() id: string): Promise<IngredientEntity> {
    return await this.ingredientService.getIngredientById(Number(id));
  }
}
