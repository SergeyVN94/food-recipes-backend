import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';

import { RecipeIngredientEntity } from './entity/recipe-ingredient.entity';
import { AmountTypeEntity } from './entity/amount-types.entity';
import { RecipeIngredientDto } from './dto/recipe-ingredient.dto';
import { AmountTypeDto } from './dto/amount-type.dto';
import { SearchFilterDto } from '@/dto/search-filter.dto';

@Injectable()
export class RecipeIngredientService {
  constructor(
    @InjectRepository(RecipeIngredientEntity)
    private recipeRepository: Repository<RecipeIngredientEntity>,
    @InjectRepository(AmountTypeEntity)
    private amountTypeRepository: Repository<AmountTypeEntity>,
  ) {}

  async getIngredients(filter: SearchFilterDto) {
    const findOptions: FindManyOptions<RecipeIngredientEntity> = {
      relations: {
        amountTypes: true,
      },
    };

    const query = (filter.q ?? '').trim().toLowerCase();
    
    if (query.length > 0) {
      findOptions.where['name'] = Like(query);
    }

    return await this.recipeRepository.find(
      findOptions,
    );
  }

  async getIngredientById(
    id: RecipeIngredientDto['id'],
  ): Promise<RecipeIngredientDto | null> {
    return await this.recipeRepository.findOne({
      where: { id },
    });
  }

  async getAmountTypes(): Promise<AmountTypeDto[]> {
    return await this.amountTypeRepository.find();
  }
}
