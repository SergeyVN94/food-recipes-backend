import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@/modules/auth/decorators/public.decorator';
import { User } from '@/modules/user/decorators/user.decorator';
import { UserAuthDto } from '@/modules/user/dto/user-auth.dto';

import { BookmarkService } from './bookmark.service';
import { BookmarkCreateDto } from './dto/bookmark-create.dto';
import { BookmarkRecipeDto } from './dto/bookmark-recipe.dto';
import { BookmarkDto } from './dto/bookmark.dto';

@ApiTags('Закладки')
@Controller('/bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @ApiResponse({ type: BookmarkDto, isArray: true })
  @Get()
  async getSelfBookmarks(@User() user: UserAuthDto) {
    return await this.bookmarkService.getBookmarks(user.id);
  }

  @ApiResponse({ type: BookmarkDto, isArray: true })
  @Public()
  @Get('/user/:userId')
  async getUserBookmarks(@Param('userId') userId: string) {
    return await this.bookmarkService.getBookmarks(userId);
  }

  @ApiResponse({ type: BookmarkDto })
  @Post()
  async createBookmark(@User() user: UserAuthDto, @Body() body: BookmarkCreateDto) {
    return await this.bookmarkService.createBookmark(user.id, body.title);
  }

  @ApiResponse({ type: BookmarkDto })
  @Patch(':id')
  async updateBookmark(@User() user: UserAuthDto, @Body() body: BookmarkCreateDto, @Param('id') id: string) {
    return await this.bookmarkService.updateBookmark(user.id, id, body.title);
  }

  @ApiResponse({ type: BookmarkDto })
  @Delete(':id')
  async deleteBookmark(@User() user: UserAuthDto, @Param('id') id: string) {
    return await this.bookmarkService.deleteBookmark(user.id, id);
  }

  @ApiResponse({ type: BookmarkRecipeDto, isArray: true })
  @Public()
  @Get('/recipes/user/:userId')
  async getRecipesInBookmarks(@Param('userId') userId: string) {
    return await this.bookmarkService.getRecipesInBookmarks(userId);
  }

  @ApiResponse({ type: BookmarkRecipeDto, isArray: true })
  @Get('/recipes')
  async getSelfRecipesInBookmarks(@User() user: UserAuthDto) {
    return await this.bookmarkService.getRecipesInBookmarks(user.id);
  }

  @Get(':bookmarkId/recipes/:recipeId')
  async addRecipeToBookmark(@Param('recipeId') recipeId: string, @Param('bookmarkId') bookmarkId: string, @User() user: UserAuthDto) {
    return await this.bookmarkService.addRecipeToBookmark(user.id, recipeId, bookmarkId);
  }

  @Delete('/recipes/:recipeId')
  async removeRecipeFromBookmark(@Param('recipeId') recipeId: string, @User() user: UserAuthDto) {
    return await this.bookmarkService.removeRecipeFromBookmark(user.id, recipeId);
  }
}
