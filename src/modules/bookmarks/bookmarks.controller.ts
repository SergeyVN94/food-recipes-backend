import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

import { Public } from '@/modules/auth/decorators/public.decorator';
import { User } from '@/modules/users/decorators/user.decorator';
import { UserAuthDto } from '@/modules/users/dto/user-auth.dto';

import { BookmarksService } from './bookmarks.service';
import { BookmarkCreateDto } from './dto/bookmark-create.dto';
import { BookmarkRecipeDto } from './dto/bookmark-recipe.dto';
import { BookmarkDto } from './dto/bookmark.dto';

@ApiTags('Закладки')
@Controller('/bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarkService: BookmarksService) {}

  @ApiOperation({ summary: 'Получить список закладок пользователя' })
  @ApiResponse({ type: BookmarkDto, isArray: true })
  @Get()
  async getSelfBookmarks(@User() user: UserAuthDto) {
    return await this.bookmarkService.getBookmarks(user.id);
  }

  @ApiOperation({ summary: 'Получить список закладок пользователя по id пользователя' })
  @ApiResponse({ type: BookmarkDto, isArray: true })
  @Public()
  @Get('/user/:userId')
  async getUserBookmarks(@Param('userId') userId: string) {
    return await this.bookmarkService.getBookmarks(userId);
  }

  @ApiOperation({ summary: 'Создать закладку' })
  @ApiResponse({ type: BookmarkDto })
  @Post()
  async createBookmark(@User() user: UserAuthDto, @Body() body: BookmarkCreateDto) {
    return await this.bookmarkService.createBookmark(user.id, body.title);
  }

  @ApiOperation({ summary: 'Обновить закладку' })
  @ApiResponse({ type: BookmarkDto })
  @Patch(':id')
  async updateBookmark(@User() user: UserAuthDto, @Body() body: BookmarkCreateDto, @Param('id') id: string) {
    return await this.bookmarkService.updateBookmark(user.id, id, body.title);
  }

  @ApiOperation({ summary: 'Удалить закладку' })
  @ApiResponse({ type: BookmarkDto })
  @Delete(':id')
  async deleteBookmark(@User() user: UserAuthDto, @Param('id') id: string) {
    return await this.bookmarkService.deleteBookmark(user.id, id);
  }

  @ApiOperation({ summary: 'Получить список рецептов в закладках пользователя' })
  @ApiResponse({ type: BookmarkRecipeDto, isArray: true })
  @Get('/recipes')
  async getSelfRecipesInBookmarks(@User() user: UserAuthDto) {
    return await this.bookmarkService.getRecipesInBookmarks(user.id);
  }

  @ApiOperation({ summary: 'Получить список рецептов в закладках пользователя по id пользователя' })
  @ApiResponse({ type: BookmarkRecipeDto, isArray: true })
  @Public()
  @Get('/recipes/user/:userId')
  async getRecipesInBookmarks(@Param('userId') userId: string) {
    return await this.bookmarkService.getRecipesInBookmarks(userId);
  }

  @ApiOperation({ summary: 'Добавить рецепт в закладку / изменить закладку рецепта' })
  @ApiResponse({ type: BookmarkRecipeDto })
  @Patch(':bookmarkId/recipes/:recipeId')
  async addRecipeToBookmark(@Param('recipeId') recipeId: string, @Param('bookmarkId') bookmarkId: string, @User() user: UserAuthDto) {
    return await this.bookmarkService.addRecipeToBookmark(user.id, recipeId, bookmarkId);
  }

  @ApiOperation({ summary: 'Удалить рецепт из закладки' })
  @ApiResponse({ type: DeleteResult })
  @Delete('/recipes/:recipeId')
  async removeRecipeFromBookmark(@Param('recipeId') recipeId: string, @User() user: UserAuthDto) {
    return await this.bookmarkService.removeRecipeFromBookmark(user.id, recipeId);
  }

  @ApiOperation({ summary: 'Получить количество добавлений рецепта в закладки' })
  @ApiResponse({ type: Number })
  @Public()
  @Get('/recipes/:recipeId/count')
  async getRecipesInBookmarkCount(@Param('recipeId') recipeId: string) {
    return await this.bookmarkService.getRecipesInBookmarkCount(recipeId);
  }
}
