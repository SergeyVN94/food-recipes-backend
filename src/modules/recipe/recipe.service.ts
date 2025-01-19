import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import createSlug from 'slugify';
import { isEmpty } from 'lodash';

import { RecipeEntity } from './entity/recipe.entity';
import { RecipeCreateDto } from './dto/recipe-create.dto';
import { RecipeStepEntity } from './entity/recipe-step.entity';
import { RecipeIngredientUnitEntity } from './entity/recipe-ingredient-unit.entity';
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

    const queryParams: Record<string, any> = {};

    let query = this.recipeRepository
      .createQueryBuilder('recipe')
      .select('recipe.id', 'id')
      .innerJoin('recipe.ingredients', 'recipeIngredients')
      .groupBy('recipe.id');

    if (filter.q?.length > 0) {
      query = query.where(`LOWER(title) LIKE LOWER('%:q%')`);
      queryParams.q = filter.q;
    }

    if (filter.userId) {
      query = query.andWhere(`recipe.userId = :userId`);
      queryParams.userId = filter.userId;
    }

    if (filter.slugs?.length > 0) {
      query = query.andWhere(`recipe.slug IN (:...slugs)`);
      queryParams.slugs = filter.slugs.filter(Boolean);
    }

    if (filter.ingredients?.excludes?.length > 0) {
      const subQuery = this.recipeIngredientUnitRepository
        .createQueryBuilder('recipeIngredients')
        .select('recipeIngredients.recipeId')
        .where(`recipeIngredients.ingredientId IN (:...excludesList)`)
        .getQuery();

      query = query.andWhere(`recipe.id NOT IN (${subQuery})`);
      queryParams.excludesList = filter.ingredients.excludes.filter(Boolean);
    }

    if (filter.ingredients?.includes?.length > 0) {
      query = query
        .andWhere(`recipeIngredients.ingredientId IN (:...includesList)`)
        .andHaving(`count(recipeIngredients.recipeId)=:includesCount`);

      queryParams.includesList = filter.ingredients.includes.filter(Boolean);
      queryParams.includesCount = filter.ingredients.includes.length;
    }

    const mainQuery = this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('recipe.steps', 'steps')
      .leftJoinAndSelect('recipe.user', 'user')
      .where(`recipe.id IN (${query.getQuery()})`)
      .andWhere(whereIsDeleted)
      .orderBy('recipe.createdAt', 'DESC')
      .setParameters(queryParams);

    console.log(mainQuery.getQueryAndParameters());

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
    dto: RecipeCreateDto,
    userId: UserEntity['id'],
  ): Promise<RecipeDto> {
    const ingredients = await this.recipeIngredientUnitRepository.save(
      dto.ingredients,
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
      images: [],
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
