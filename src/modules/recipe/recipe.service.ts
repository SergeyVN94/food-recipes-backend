import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import createSlug from 'slugify';
import { castArray, isEmpty, omit } from 'lodash';
import * as path from 'path';
import * as fs from 'fs';

import { RecipeEntity } from './entity/recipe.entity';
import { Recipe, RecipeFilter } from './types';
import { RecipeDto } from './dto/recipe.dto';
import { RecipeStepEntity } from './entity/recipe-step.entity';
import { RecipeResponse } from './recipe.types';
import { RecipeIngredientUnitEntity } from './entity/recipe-ingredient-unit.entity';
import { AmountTypeEntity } from '../recipe-ingredient/entity/amount-types.entity';
import { RecipeIngredientEntity } from '../recipe-ingredient/entity/recipe-ingredient.entity';
import { MinioClientService } from '../minio-client/minio-client.service';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private recipeRepository: Repository<RecipeEntity>,
    @InjectRepository(RecipeStepEntity)
    private recipeStepRepository: Repository<RecipeStepEntity>,
    @InjectRepository(RecipeIngredientUnitEntity)
    private recipeIngredientUnitRepository: Repository<RecipeIngredientUnitEntity>,
    @Inject(MinioClientService)
    private minioClientService: MinioClientService,
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
        .map((s) => s.trim())
        .filter(Boolean);

      findOptions.where['slug'] = In(filteredSlugs);
    }

    return await this.recipeRepository.find(findOptions);
  }

  async getRecipeBySlug(
    slug: Recipe['slug'],
  ): Promise<Omit<RecipeEntity, 'steps' | 'id'> & { steps: string[] }> {
    const recipe = await this.recipeRepository.findOne({
      where: { slug: slug.trim() },
      relations: {
        steps: true,
        ingredients: {
          amountType: true,
          ingredient: true,
        },
      },
    });

    if (recipe) {
      return {
        ...omit(recipe, 'id'),
        steps: recipe.steps
          .sort((a, b) => (a.order < b.order ? -1 : 1))
          .map((i) => i.content),
      };
    }

    return null;
  }

  async saveRecipe(
    dto: Omit<RecipeDto, 'images'>,
    files: Express.Multer.File[],
  ): Promise<RecipeResponse> {
    console.log(files);
    
    const images = await Promise.all(files.map(file => this.minioClientService.upload(file, 'recipes')));

    console.log(images);
    

    const ingredientObjects = dto.ingredients.map((ingredientJSON, index) => {
      let ingredientObj;

      try {
        ingredientObj = JSON.parse(ingredientJSON);
      } catch (error) {
        throw new HttpException(
          `Invalid insgredient value at index ${index}`,
          HttpStatus.EXPECTATION_FAILED,
        );
      }

      const { ingredientId, amountTypeId, count } = ingredientObj;
      const normalizedCount = parseInt(count, 10);
      
      const isValidIngredientId =
        typeof ingredientId === 'string' && ingredientId.length > 0;
      const isValidAmountTypeId =
        typeof amountTypeId === 'string' && amountTypeId.length > 0;
      const isValidCount = typeof normalizedCount === 'number' && normalizedCount > 0;

      if (!isValidIngredientId || !isValidAmountTypeId || !isValidCount) {
        throw new HttpException(
          `Invalid insgredient value at index ${index}`,
          HttpStatus.EXPECTATION_FAILED,
        );
      }

      const amountType = new AmountTypeEntity();
      amountType.id = amountTypeId;

      const ingredient = new RecipeIngredientEntity();
      ingredient.id = ingredientId;

      return {
        amountType,
        ingredient,
        count: normalizedCount,
      };
    });

    const ingredients = await this.recipeIngredientUnitRepository.save(ingredientObjects);
    
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
      images: images.map(i => i.path),
      ingredients,
      description: dto.description,
      title: dto.title,
    });

    return {
      ...omit(recipe, 'id'),
      steps: recipe.steps
        .sort((a, b) => (a.order < b.order ? -1 : 1))
        .map((i) => i.content),
    };
  }
}
