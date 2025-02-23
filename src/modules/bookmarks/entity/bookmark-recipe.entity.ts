import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RecipeEntity } from '@/modules/recipes/entity/recipe.entity';
import { UserEntity } from '@/modules/users/user.entity';

import { BookmarkEntity } from './bookmark.entity';

@Entity()
export class BookmarkRecipeEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Exclude()
  @ManyToOne(() => BookmarkEntity)
  @JoinColumn({ name: 'bookmarkId' })
  bookmark: BookmarkEntity;

  @ApiProperty()
  @Column({ nullable: false, type: 'uuid' })
  bookmarkId: string;

  @Exclude()
  @ManyToOne(() => RecipeEntity)
  @JoinColumn({ name: 'recipeId' })
  recipe: RecipeEntity;

  @ApiProperty()
  @Column({ nullable: false, type: 'uuid' })
  recipeId: string;

  @Exclude()
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Exclude()
  @Column({ nullable: false, type: 'uuid' })
  userId: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
