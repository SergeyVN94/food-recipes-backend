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
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookmarkDto } from './dto/bookmark.dto';
import { BookmarkCreateDto } from './dto/bookmark-create.dto';
import { BookmarkRecipeDto } from './dto/bookmark-recipe.dto';

@ApiTags('Закладки')
@Controller('/bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @ApiResponse({ type: BookmarkDto, isArray: true })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getBookmarks(@Req() req) {
    return await this.bookmarksService.getBookmarks(req.user.userId);
  }

  @ApiResponse({ type: BookmarkDto })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createBookmark(@Req() req, @Body() body: BookmarkCreateDto) {
    return await this.bookmarksService.createBookmark(
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
    return await this.bookmarksService.updateBookmark(
      req.user.userId,
      id,
      body.title,
    );
  }

  @ApiResponse({ type: BookmarkDto })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteBookmark(@Req() req, @Param('id') id: string) {
    return await this.bookmarksService.deleteBookmark(req.user.userId, id);
  }

  @ApiResponse({ type: BookmarkRecipeDto, isArray: true })
  @Get('/recipes')
  @UseGuards(JwtAuthGuard)
  async getRecipesInBookmarks(@Req() req) {
    return await this.bookmarksService.getRecipesInBookmarks(req.user.userId);
  }

  @Get(':bookmarkId/recipes/:recipeId')
  @UseGuards(JwtAuthGuard)
  async addRecipeToBookmark(
    @Param('recipeId') recipeId: string,
    @Param('bookmarkId') bookmarkId: string,
    @Req() req,
  ) {
    return await this.bookmarksService.addRecipeToBookmark(
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
    return await this.bookmarksService.removeRecipeFromBookmark(
      req.user.userId,
      recipeId,
    );
  }
}
