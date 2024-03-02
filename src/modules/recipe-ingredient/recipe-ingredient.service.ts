import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';

import { RecipeIngredientEntity } from './recipe-ingredient.entity';
import { AmountType, QueryFilter, RecipeIngredient } from './recipe-ingredient.types';
import { AmountTypeEntity } from './amount-types.entity';

@Injectable()
export class RecipeIngredientService {
  constructor(
    @InjectRepository(RecipeIngredientEntity)
    private recipeRepository: Repository<RecipeIngredientEntity>,
    @InjectRepository(AmountTypeEntity)
    private amountTypeRepository: Repository<AmountTypeEntity>,
  ) {}

  async getIngredients(filter: QueryFilter = {}) {
    const findOptions: FindManyOptions<RecipeIngredientEntity> = {};

    const query = (filter.query ?? '').trim().toLowerCase();
    if (query.length > 0) {
      findOptions.where['name'] = Like(query);
    }

    return await this.recipeRepository.find(
      findOptions,
    );
  }

  async getIngredientById(
    id: RecipeIngredient['id'],
  ): Promise<RecipeIngredient | null> {
    return await this.recipeRepository.findOne({
      where: { id },
    });
  }

  async getAmountTypes(): Promise<AmountType[]> {
    return (await this.amountTypeRepository.find() ?? []);
  }
}
