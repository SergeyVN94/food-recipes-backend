import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { BookmarkRecipeEntity } from './entity/bookmark-recipe.entity';
import { BookmarkEntity } from './entity/bookmark.entity';

@Module({
  providers: [BookmarksService],
  controllers: [BookmarksController],
  exports: [BookmarksService],
  imports: [TypeOrmModule.forFeature([BookmarkEntity, BookmarkRecipeEntity])],
})
export class BookmarksModule {}
