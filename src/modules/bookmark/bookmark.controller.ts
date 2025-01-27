import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/modules/auth/jwt.guard';

import { BookmarkService } from './bookmark.service';
import { BookmarkDto } from './dto/bookmark.dto';
import { BookmarkCreateDto } from './dto/bookmark-create.dto';
import { BookmarkRecipeDto } from './dto/bookmark-recipe.dto';

@ApiTags('Закладки')
@Controller('/bookmarks')
export class BookmarkController {
  constructor(private readonly BookmarkService: BookmarkService) {}

  @ApiResponse({ type: BookmarkDto, isArray: true })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getSelfBookmarks(@Req() req) {
    return await this.BookmarkService.getBookmarks(req.user.userId);
  }

  @ApiResponse({ type: BookmarkDto, isArray: true })
  @Get('/user/:userId')
  async getUserBookmarks(@Param('userId') userId: string) {
    return await this.BookmarkService.getBookmarks(userId);
  }

  @ApiResponse({ type: BookmarkDto })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createBookmark(@Req() req, @Body() body: BookmarkCreateDto) {
    return await this.BookmarkService.createBookmark(
      req.user.userId,
      body.title,
    );
  }

  @ApiResponse({ type: BookmarkDto })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateBookmark(
    @Req() req,
    @Body() body: BookmarkCreateDto,
    @Param('id') id: string,
  ) {
    return await this.BookmarkService.updateBookmark(
      req.user.userId,
      id,
      body.title,
    );
  }

  @ApiResponse({ type: BookmarkDto })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteBookmark(@Req() req, @Param('id') id: string) {
    return await this.BookmarkService.deleteBookmark(req.user.userId, id);
  }

  @ApiResponse({ type: BookmarkRecipeDto, isArray: true })
  @Get('/recipes/user/:userId')
  async getRecipesInBookmarks(@Param('userId') userId: string) {
    return await this.BookmarkService.getRecipesInBookmarks(userId);
  }

  @ApiResponse({ type: BookmarkRecipeDto, isArray: true })
  @Get('/recipes')
  @UseGuards(JwtAuthGuard)
  async getSelfRecipesInBookmarks(@Req() req) {
    return await this.BookmarkService.getRecipesInBookmarks(req.user.userId);
  }

  @Get(':bookmarkId/recipes/:recipeId')
  @UseGuards(JwtAuthGuard)
  async addRecipeToBookmark(
    @Param('recipeId') recipeId: string,
    @Param('bookmarkId') bookmarkId: string,
    @Req() req,
  ) {
    return await this.BookmarkService.addRecipeToBookmark(
      req.user.userId,
      recipeId,
      bookmarkId,
    );
  }

  @Delete('/recipes/:recipeId')
  @UseGuards(JwtAuthGuard)
  async removeRecipeFromBookmark(
    @Param('recipeId') recipeId: string,
    @Req() req,
  ) {
    return await this.BookmarkService.removeRecipeFromBookmark(
      req.user.userId,
      recipeId,
    );
  }
}
