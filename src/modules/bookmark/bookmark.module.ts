import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { BookmarkEntity } from './entity/bookmark.entity';
import { BookmarkRecipeEntity } from './entity/bookmark-recipe.entity';

@Module({
  providers: [BookmarkService],
  controllers: [BookmarkController],
  exports: [BookmarkService],
  imports: [TypeOrmModule.forFeature([BookmarkEntity, BookmarkRecipeEntity])],
})
export class BookmarkModule {}
