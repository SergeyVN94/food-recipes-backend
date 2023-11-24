import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import * as createSlug from 'slug';
import * as _ from 'lodash';

import { RecipeEntity } from './recipe.entity';
import { Recipe, RecipeFilter } from './types';
import { RecipeDto } from './recipe.dto';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private recipeRepository: Repository<RecipeEntity>,
  ) {}

  async getRecipes(filter: RecipeFilter = {}): Promise<RecipeEntity[]> {
    if (_.isEmpty(filter)) {
      return await this.recipeRepository.find();
    }

    const findOptions: FindManyOptions<RecipeEntity> = { where: {} };

    if ('query' in filter) {
      findOptions.where['title'] = Like(
        `%${String(filter.query).trim().toLowerCase()}%`,
      );
    }

    if ('slugs' in filter) {
      const filteredSlugs = _.castArray(filter.slugs)
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      findOptions.where['slug'] = In(filteredSlugs);
    }

    return await this.recipeRepository.find(findOptions);
  }

  async getRecipeBySlug(slug: Recipe['slug']): Promise<RecipeEntity> {
    return await this.recipeRepository.findOne({
      where: { slug: slug.trim().toLowerCase() },
    });
  }

  async saveRecipe(recipeDto: RecipeDto): Promise<RecipeEntity> {
    console.log(recipeDto);
    
    const slug = createSlug(recipeDto.title, {
      replacement: '_',
      trim: true,
    });

    const result = await this.recipeRepository.save({
      slug,
      images: recipeDto.images,
      description: recipeDto.description,
      ingredients: [],
      steps: recipeDto.steps,
      title: recipeDto.title,
    });

    return result;
  }
}
