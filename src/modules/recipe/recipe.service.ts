import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import * as _ from 'lodash';

import { RecipeEntity } from './recipe.entity';

import { Recipe } from './types';

interface FetchFilter {
  query?: string;
  slugs?: string[];
}

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private recipeRepository: Repository<RecipeEntity>,
  ) {}

  async getRecipes(filter?: FetchFilter): Promise<Recipe[]> {
    if (_.isEmpty(filter)) {
      return await this.recipeRepository.find({
        cache: { milliseconds: 1000 * 60 * 3, id: null }
      }) as Recipe[];
    }

    const { query = '', slugs } = filter;
    const filteredSlugs = slugs.map(s => s.trim().toLowerCase()).filter(Boolean);
    const findOptions: FindManyOptions<RecipeEntity> = {};

    if (query) {
      findOptions.where['title'] = Like(`%${query.trim().toLowerCase()}%`);
    }
    if (filteredSlugs.length > 0) {
      findOptions.where['slug'] = In(filteredSlugs);
    }

    return await this.recipeRepository.find(findOptions) as Recipe[];
  }

  async getRecipeBySlug(slug: Recipe['slug']): Promise<Recipe | null> {
    const recipe = await this.recipeRepository.findOne({
      where: { slug: slug.trim().toLowerCase() }
    });

    return recipe as Recipe ?? null;
  }
}
