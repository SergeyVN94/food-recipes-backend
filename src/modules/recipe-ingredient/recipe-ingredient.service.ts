import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import * as _ from 'lodash';

import { RecipeIngredientEntity } from './recipe-ingredient.entity';
import { AmountType, QueryFilter, RecipeIngredient } from './types';

import * as amountTypes from './amount-types.json';

@Injectable()
export class RecipeIngredientService {
  constructor(
    @InjectRepository(RecipeIngredientEntity)
    private recipeRepository: Repository<RecipeIngredientEntity>,
  ) {}

  async getIngredients(filter: QueryFilter = {}) {
    const findOptions: FindManyOptions<RecipeIngredientEntity> = {};

    const query = (filter.query ?? '').trim().toLowerCase();
    if (query.length > 0) {
      findOptions.where['name'] = Like(query);
    }

    return (await this.recipeRepository.find(
      findOptions,
    )) as RecipeIngredient[];
  }

  getAmountTypes() {
    return amountTypes.amountTypes as AmountType[];
  }

  async getIngredientById(
    id: RecipeIngredient['id'],
  ): Promise<RecipeIngredient | null> {
    return (
      ((await this.recipeRepository.findOne({
        where: { id: parseInt(String(id), 10) },
      })) as RecipeIngredient) ?? null
    );
  }

  // async get(filter?: { query?: string, limit?: number }): Promise<RecipeIngredient | null> {
  //   return await this.recipeRepository.findOne({
  //     where: { id: parseInt(String(id), 10)
  //   } }) as RecipeIngredient ?? null;
  // }
}
