import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import createSlug from 'slugify';
import { castArray, isEmpty, omit } from 'lodash';

import { RecipeEntity } from './entity/recipe.entity';
import { Recipe } from './types';
import { RecipeDto } from './dto/recipe.dto';
import { RecipeStepEntity } from './entity/recipe-step.entity';
import { RecipeResponse } from './recipe.types';
import { RecipeIngredientUnitEntity } from './entity/recipe-ingredient-unit.entity';
import { AmountTypeEntity } from '../recipe-ingredient/entity/amount-types.entity';
import { RecipeIngredientEntity } from '../recipe-ingredient/entity/recipe-ingredient.entity';
import { MinioClientService } from '../minio-client/minio-client.service';
import { RecipesFilterDto } from './dto/filter.dto';

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

  async getRecipes(filter: RecipesFilterDto = {}): Promise<RecipeEntity[]> {
    if (isEmpty(filter)) {
      return await this.recipeRepository.find();
    }

    let query = this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoin('recipe.steps', 'steps')
      .leftJoinAndSelect('recipe.ingredients', 'ingredient');

    if (filter.q?.length > 0) {
      query = query.where(`LOWER(title) LIKE LOWER('%${filter.q}%')`);
    }

    if ('slugs' in filter && filter.slugs.length > 0) {
      query = query.andWhere({
        slug: In(filter.slugs),
      });
    }

    const isIngredientsExist =
      'ingredients' in filter &&
      ((Array.isArray(filter.ingredients.excludes) &&
        filter.ingredients.excludes?.length > 0) ||
        (Array.isArray(filter.ingredients.includes) &&
          filter.ingredients.includes?.length > 0));

    if (isIngredientsExist) {
      const excludesList = filter.ingredients.excludes
        ?.map((i) => `'${i}'`)
        .join(',');
      const includesList = filter.ingredients.includes
        ?.map((i) => `'${i}'`)
        .join(',');

      if (excludesList) {
        const subQuery = this.recipeIngredientUnitRepository.createQueryBuilder('ingredient').select('recipeId').where(`ingredient.ingredientId IN (${excludesList})`).getQuery();

        query = query.andWhere(
          `"recipe"."id" NOT IN (${subQuery})`,
        );
      }

      if (includesList) {
        query = query.andWhere(`ingredient.ingredientId IN (${includesList})`);
      }
    }

    return await query.getMany();
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
    const images = await Promise.all(
      files.map((file) => this.minioClientService.upload(file, 'recipes')),
    );

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
      const isValidCount =
        typeof normalizedCount === 'number' && normalizedCount > 0;

      if (!isValidIngredientId || !isValidAmountTypeId || !isValidCount) {
        throw new HttpException(
          `Invalid ingredient value at index ${index}`,
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

    const ingredients = await this.recipeIngredientUnitRepository.save(
      ingredientObjects,
    );

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
      images: images.map((i) => i.path),
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
