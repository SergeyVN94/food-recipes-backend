import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import createSlug from 'slugify';
import { isEmpty } from 'lodash';

import { RecipeEntity } from './entity/recipe.entity';
import { RecipeCreateDto } from './dto/recipe-create.dto';
import { RecipeStepEntity } from './entity/recipe-step.entity';
import { RecipeIngredientUnitEntity } from './entity/recipe-ingredient-unit.entity';
import { AmountTypeEntity } from '../ingredient/entity/amount-types.entity';
import { IngredientEntity } from '../ingredient/entity/ingredient.entity';
import { MinioClientService } from '../minio-client/minio-client.service';
import { RecipesFilterDto } from './dto/filter.dto';
import { RecipeDto } from './dto/recipe.dto';
import { UserDto } from '../user/dto/user.dto';
import { UserRole } from '../user/types';
import { UserEntity } from '../user/user.entity';

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

  async getRecipes(
    filter: RecipesFilterDto = {},
    user?: UserDto | null,
  ): Promise<RecipeDto[]> {
    const isAdmin = user && user.role === UserRole.ADMIN;
    const isDeleted = filter.isDeleted ?? false;
    const whereIsDeleted = { isDeleted: Boolean(isAdmin && isDeleted) };

    if (isEmpty(filter)) {
      return await this.recipeRepository.find({
        where: whereIsDeleted,
        relations: {
          steps: true,
          ingredients: {
            ingredient: true,
            amountType: true,
          },
          user: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
    }

    let query = this.recipeRepository
      .createQueryBuilder('recipe')
      .select('recipe.id', 'id')
      .innerJoin('recipe.ingredients', 'recipeIngredients')
      .groupBy('recipeIngredients.recipeId');

    if (filter.q?.length > 0) {
      query = query.where(`LOWER(title) LIKE LOWER('%${filter.q}%')`);
    }

    if (filter.userId) {
      query = query.andWhere(`recipe.userId = '${filter.userId}'`);
    }

    if ('slugs' in filter && filter.slugs.length > 0) {
      query = query.andWhere(`recipe.slug IN (${filter.slugs.join(',')})`);
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

      if (excludesList && excludesList.length > 0) {
        const subQuery = this.recipeIngredientUnitRepository
          .createQueryBuilder('recipeIngredients')
          .select('recipeId')
          .where(`recipeIngredients.ingredientId IN (${excludesList})`)
          .getQuery();

        query = query.andWhere(`"recipe"."id" NOT IN (${subQuery})`);
      }

      if (includesList && includesList.length > 0) {
        query = query
          .andWhere(`recipeIngredients.ingredientId IN (${includesList})`)
          .andHaving(
            `count(recipeIngredients.recipeId)=${filter.ingredients.includes.length}`,
          );
      }
    }

    const mainQuery = this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('recipe.steps', 'steps')
      .leftJoinAndSelect('recipe.user', 'user')
      .where(`recipe.id IN (${query.getQuery()})`)
      .andWhere(whereIsDeleted)
      .orderBy('recipe.createdAt', 'DESC');

    const result = await mainQuery.getMany();

    return result.map((recipe) => recipe.toDto());
  }

  async getRecipeBySlug(
    slug: RecipeEntity['slug'],
    user?: UserDto | null,
    isDeleted = false,
  ): Promise<RecipeDto> {
    const isAdmin = user && user.role === UserRole.ADMIN;

    const recipe = await this.recipeRepository.findOne({
      where: { slug, isDeleted: isAdmin && isDeleted },
      relations: {
        steps: true,
        ingredients: true,
        user: true,
      },
    });

    return recipe?.toDto();
  }

  async getRecipeById(
    id: RecipeEntity['id'],
    user?: UserDto | null,
    isDeleted = false,
  ): Promise<RecipeDto> {
    const isAdmin = user && user.role === UserRole.ADMIN;

    const recipe = await this.recipeRepository.findOne({
      where: { id, isDeleted: isAdmin && isDeleted },
      relations: {
        steps: true,
        ingredients: true,
        user: true,
      },
    });

    return recipe?.toDto();
  }

  async saveRecipe(
    dto: Omit<RecipeCreateDto, 'images'>,
    files: Express.Multer.File[],
    userId: UserEntity['id'],
  ): Promise<RecipeDto> {
    const images = await Promise.all(
      files.map((file) => this.minioClientService.upload(file, 'recipes')),
    );

    const ingredientObjects = dto.ingredients.map((ingredientJSON, index) => {
      let ingredientObj;

      try {
        ingredientObj = JSON.parse(ingredientJSON);
      } catch (error) {
        throw new HttpException(
          `Invalid ingredient value at index ${index}`,
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
      amountType.id = Number(amountTypeId);

      const ingredient = new IngredientEntity();
      ingredient.id = Number(ingredientId);

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

    const user = new UserEntity();
    user.id = userId;

    const { id } = await this.recipeRepository.save({
      user,
      slug,
      steps,
      ingredients,
      images: images.map((image) => image.path),
      description: dto.description,
      title: dto.title,
    });

    return await this.getRecipeById(id, null, true);
  }

  async markAsDeleted(id: RecipeEntity['id']): Promise<void> {
    await this.recipeRepository.update({ id }, { isDeleted: true });
  }

  async deleteRecipe(id: RecipeEntity['id']): Promise<DeleteResult> {
    return await this.recipeRepository.delete({ id });
  }
}
