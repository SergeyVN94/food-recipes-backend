import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import createSlug from 'slugify';
import { Repository } from 'typeorm';

import { BookmarkRecipeEntity } from './entity/bookmark-recipe.entity';
import { BookmarkEntity } from './entity/bookmark.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(BookmarkEntity)
    private bookmarkRepository: Repository<BookmarkEntity>,
    @InjectRepository(BookmarkRecipeEntity)
    private bookmarkRecipeRepository: Repository<BookmarkRecipeEntity>,
  ) {}

  async getBookmarks(userId: string) {
    return await this.bookmarkRepository.find({
      where: { userId },
    });
  }

  async createBookmark(userId: string, title: string) {
    const slug = createSlug(title, {
      replacement: '_',
      trim: true,
    });

    const isSlugExists =
      (await this.bookmarkRepository.count({
        where: {
          slug,
          userId,
        },
      })) > 0;

    if (isSlugExists) {
      throw new ConflictException('BOOKMARK_WITH_THIS_TITLE_ALREADY_EXISTS');
    }

    const { id: bookmarkId } = await this.bookmarkRepository.save({
      userId,
      title,
      slug,
    });

    return await this.bookmarkRepository.findOne({
      where: {
        id: bookmarkId,
      },
    });
  }

  async updateBookmark(userId: string, bookmarkId: string, title: string) {
    const slug = createSlug(title, {
      replacement: '_',
      trim: true,
    });

    const isSlugExists =
      (await this.bookmarkRepository.count({
        where: {
          slug,
          userId,
        },
      })) > 0;

    if (isSlugExists) {
      throw new ConflictException('BOOKMARK_WITH_THIS_TITLE_ALREADY_EXISTS');
    }

    return await this.bookmarkRepository.update(
      { id: bookmarkId },
      {
        title,
        slug,
      },
    );
  }

  async deleteBookmark(userId: string, bookmarkId: string) {
    const bookmark = await this.bookmarkRepository.findOne({
      where: [{ id: bookmarkId }, { userId }],
    });

    if (!bookmark) {
      throw new NotFoundException();
    }

    await this.bookmarkRecipeRepository.delete({
      bookmarkId,
    });

    return await this.bookmarkRepository.delete({
      id: bookmarkId,
      userId,
    });
  }

  async getRecipesInBookmarks(userId: string) {
    const bookmarksRecipes = await this.bookmarkRecipeRepository.find({
      where: {
        userId,
      },
    });

    return bookmarksRecipes;
  }

  async addRecipeToBookmark(userId: string, recipeId: string, bookmarkId: string) {
    const bookmark = await this.bookmarkRepository.findOne({
      where: {
        userId,
        id: bookmarkId,
      },
    });

    if (!bookmark) {
      throw new NotFoundException();
    }

    await this.bookmarkRecipeRepository.delete({
      userId,
      recipeId,
    });

    const { id: recipeBookmarkId } = await this.bookmarkRecipeRepository.save({
      userId,
      recipeId,
      bookmarkId,
    });

    return await this.bookmarkRecipeRepository.findOne({
      where: {
        id: recipeBookmarkId,
      },
    });
  }

  async removeRecipeFromBookmark(userId: string, recipeId: string) {
    return await this.bookmarkRecipeRepository.delete({ recipeId, userId });
  }

  async removeRecipeFromAllBookmarks(recipeId: string) {
    return await this.bookmarkRecipeRepository.delete({ recipeId });
  }

  async getRecipesInBookmarkCount(recipeId: string) {
    return await this.bookmarkRecipeRepository.count({
      where: {
        recipeId,
      },
    });
  }
}
