import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import createSlug from 'slug';
import { castArray, isEmpty, omit } from 'lodash';
import * as path from 'path';
import * as fs from 'fs';

import { RecipeEntity } from './recipe.entity';
import { Recipe, RecipeFilter } from './types';
import { RecipeDto } from './recipe.dto';
import { RecipeStepEntity } from './recipe-step.entity';
import { RecipeResponse } from './recipe.types';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private recipeRepository: Repository<RecipeEntity>,
    @InjectRepository(RecipeStepEntity)
    private recipeStepRepository: Repository<RecipeStepEntity>,
  ) {}

  async getRecipes(filter: RecipeFilter = {}): Promise<RecipeEntity[]> {
    if (isEmpty(filter)) {
      return await this.recipeRepository.find();
    }

    const findOptions: FindManyOptions<RecipeEntity> = { where: {} };

    if ('q' in filter) {
      findOptions.where['title'] = Like(
        `%${String(filter.q).trim().toLowerCase()}%`,
      );
    }

    if ('slugs' in filter) {
      const filteredSlugs = castArray(filter.slugs)
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      findOptions.where['slug'] = In(filteredSlugs);
    }

    return await this.recipeRepository.find(findOptions);
  }

  async getRecipeBySlug(
    slug: Recipe['slug'],
  ): Promise<Omit<RecipeEntity, 'steps' | 'id'> & { steps: string[] }> {
    const recipe = await this.recipeRepository.findOne({
      where: { slug: slug.trim().toLowerCase() },
      relations: {
        steps: true,
      }
    });

    if (recipe) {
      return ({
        ...omit(recipe, 'id'),
        steps: recipe.steps.sort((a, b) => a.order < b.order ? -1 : 1).map(i => i.content)
      });
    }

    return null;
  }

  async saveRecipe(
    dto: Omit<RecipeDto, 'images'>,
    files: Express.Multer.File[],
  ): Promise<RecipeResponse> {
    const saveFilePromises = [];

    const images = files.map((f) => {
      const ext = path.extname(f.originalname);
      const newName = crypto.randomUUID() + ext;
      const rootDir = path.join(__dirname, '../../..');
      const fullFileName = `${rootDir}/public/recipes/${newName}`;

      saveFilePromises.push(
        new Promise((resolve, reject) => {
          fs.writeFile(fullFileName, f.buffer, (err) => {
            if (err) {
              reject(err);
              return;
            }

            resolve('');
          });
        }),
      );

      return newName;
    });

    await Promise.all(saveFilePromises);

    const slug = createSlug(dto.title, {
      replacement: '_',
      trim: true,
    });

    const steps = await this.recipeStepRepository.save(
      dto.steps.map((step, index) => ({
        order: index,
        content: step,
      })),
    );

    const recipe = await this.recipeRepository.save({
      slug,
      steps,
      images,
      description: dto.description,
      ingredients: [],
      title: dto.title,
    });

    return ({
      ...omit(recipe, 'id'),
      steps: recipe.steps.sort((a, b) => a.order < b.order ? -1 : 1).map(i => i.content)
    });
  }
}
