import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { BookmarkEntity } from './entity/bookmark.entity';
import { BookmarkRecipeEntity } from './entity/bookmark-recipte.entity';

@Module({
  providers: [BookmarksService],
  controllers: [BookmarksController],
  exports: [BookmarksService],
  imports: [TypeOrmModule.forFeature([BookmarkEntity, BookmarkRecipeEntity])],
})
export class BookmarksModule {}
