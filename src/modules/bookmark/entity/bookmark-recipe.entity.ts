import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RecipeEntity } from '@/modules/recipe';
import { UserEntity } from '@/modules/user/user.entity';

import { BookmarkRecipeDto } from '../dto/bookmark-recipe.dto';
import { BookmarkEntity } from './bookmark.entity';

@Entity()
export class BookmarkRecipeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => BookmarkEntity)
  @JoinColumn({ name: 'bookmarkId' })
  bookmark: BookmarkEntity;

  @Column({ nullable: false })
  bookmarkId: string;

  @ManyToMany(() => RecipeEntity)
  @JoinColumn({ name: 'recipeId' })
  recipe: RecipeEntity;

  @Column({ nullable: false })
  recipeId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: false })
  userId: string;

  @CreateDateColumn()
  createdAt: string;

  toDto(): BookmarkRecipeDto {
    return {
      id: this.id,
      bookmarkId: this.bookmarkId,
      recipeId: this.recipeId,
      createdAt: this.createdAt,
    };
  }
}
