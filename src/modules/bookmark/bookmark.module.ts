import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { BookmarkRecipeEntity } from './entity/bookmark-recipe.entity';
import { BookmarkEntity } from './entity/bookmark.entity';

@Module({
  providers: [BookmarkService],
  controllers: [BookmarkController],
  exports: [BookmarkService],
  imports: [TypeOrmModule.forFeature([BookmarkEntity, BookmarkRecipeEntity])],
})
export class BookmarkModule {}
