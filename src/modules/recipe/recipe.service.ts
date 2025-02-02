import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import createSlug from 'slugify';
import { Repository } from 'typeorm';

import { BookmarkService } from '@/modules/bookmark/bookmark.service';
import { UserAuthDto } from '@/modules/user/dto/user-auth.dto';
import { UserDto } from '@/modules/user/dto/user.dto';
import { UserRole } from '@/modules/user/types';
import { UserEntity } from '@/modules/user/user.entity';

import { RecipesFilterDto } from './dto/filter.dto';
import { RecipeCreateDto } from './dto/recipe-create.dto';
import { RecipeUpdateDto } from './dto/recipe-update.dto';
import { RecipeDto } from './dto/recipe.dto';
import { RecipeIngredientUnitEntity } from './entity/recipe-ingredient-unit.entity';
import { RecipeStepEntity } from './entity/recipe-step.entity';
import { RecipeEntity } from './entity/recipe.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private recipeRepository: Repository<RecipeEntity>,
    @InjectRepository(RecipeStepEntity)
    private recipeStepRepository: Repository<RecipeStepEntity>,
    @InjectRepository(RecipeIngredientUnitEntity)
    private recipeIngredientUnitRepository: Repository<RecipeIngredientUnitEntity>,
    private bookmarkService: BookmarkService,
  ) {}

  async getRecipes(filter: RecipesFilterDto = {}, user?: UserAuthDto | null): Promise<RecipeDto[]> {
    const isAdmin = user && user.role === UserRole.ADMIN;
    const isDeleted = filter.isDeleted ?? false;
    const whereIsDeleted = { isDeleted: Boolean(isAdmin && isDeleted) };

    if (Object.values(filter).length === 0) {
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
      query = query.where(`LOWER(recipe.title) LIKE LOWER(:q)`);
      queryParams.q = `%${filter.q}%`;
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

    const result = await mainQuery.getMany();

    return result.map(recipe => recipe.toDto());
  }

  async getRecipeBySlug(slug: RecipeEntity['slug'], user?: UserDto | null, isDeleted = false): Promise<RecipeDto> {
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

  async getRecipeById(id: RecipeEntity['id'], user?: UserDto | null, isDeleted = false): Promise<RecipeDto> {
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

  async saveRecipe(dto: RecipeCreateDto, userId: UserEntity['id']): Promise<RecipeDto> {
    const slug = createSlug(dto.title, {
      replacement: '_',
      trim: true,
    });

    const isSlugExists =
      (await this.recipeRepository.count({
        where: {
          slug,
        },
      })) > 0;

    if (isSlugExists) {
      throw new ConflictException('RECIPE_WITH_THIS_TITLE_ALREADY_EXISTS');
    }

    const ingredients = await this.recipeIngredientUnitRepository.save(dto.ingredients);

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

  async updateRecipe(slug: RecipeEntity['slug'], dto: RecipeUpdateDto, user: UserAuthDto) {
    const recipe = await this.recipeRepository.findOne({
      where: {
        slug,
      },
      relations: {
        steps: true,
        ingredients: true,
        user: true,
      },
    });

    if (!recipe) {
      throw new NotFoundException();
    }

    if (user.role !== UserRole.ADMIN && recipe.user.id !== user.id) {
      throw new ForbiddenException('INSUFFICIENT_PERMISSIONS'); // недостаточно прав
    }

    const nextSlug = dto.title
      ? createSlug(dto.title ?? '', {
          replacement: '_',
          trim: true,
        })
      : recipe.slug;

    if (recipe.slug !== nextSlug) {
      const isSlugExists =
        (await this.recipeRepository.count({
          where: {
            slug: nextSlug,
          },
        })) > 0;

      if (isSlugExists) {
        throw new ConflictException('RECIPE_WITH_THIS_TITLE_ALREADY_EXISTS');
      }
    }

    recipe.slug = nextSlug;
    recipe.title = dto.title;
    recipe.description = dto.description;

    if (dto.ingredients) {
      await this.recipeIngredientUnitRepository.delete({ recipeId: recipe.id });

      recipe.ingredients = await this.recipeIngredientUnitRepository.save(dto.ingredients);
    }

    if (dto.steps) {
      await this.recipeStepRepository.delete({ recipeId: recipe.id });

      recipe.steps = await this.recipeStepRepository.save(
        dto.steps.map((step, index) => ({
          order: index,
          content: step,
        })),
      );
    }

    const { id } = await this.recipeRepository.save(recipe);

    return await this.getRecipeById(id);
  }

  async markAsDeleted(id: RecipeEntity['id'], user: UserDto): Promise<void> {
    const recipe = await this.getRecipeById(id, user);

    if (!recipe) {
      throw new NotFoundException();
    }

    if (!user || user.role !== UserRole.ADMIN || recipe.user.id !== user.id) {
      throw new ForbiddenException('INSUFFICIENT_PERMISSIONS'); // недостаточно прав
    }

    await this.recipeRepository.update({ id }, { isDeleted: true });
  }

  async deleteRecipe(slug: RecipeEntity['slug'], user: UserAuthDto): Promise<RecipeDto> {
    const recipe = await this.getRecipeBySlug(slug);

    if (!recipe) {
      throw new NotFoundException();
    }

    if (user.role !== UserRole.ADMIN && recipe.user.id !== user.id) {
      throw new ForbiddenException('INSUFFICIENT_PERMISSIONS'); // недостаточно прав
    }

    await this.bookmarkService.removeRecipeFromAllBookmarks(recipe.id);
    await this.recipeStepRepository.delete({ recipeId: recipe.id });
    await this.recipeIngredientUnitRepository.delete({ recipeId: recipe.id });
    const result = await this.recipeRepository.delete({ slug });

    if (!result.affected) {
      throw new NotFoundException();
    }

    return recipe;
  }
}
