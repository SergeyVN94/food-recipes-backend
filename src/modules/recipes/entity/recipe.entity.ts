import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '@/modules/users/user.entity';

import { RecipeIngredientUnitEntity } from './recipe-ingredient-unit.entity';
import { RecipeStepEntity } from './recipe-step.entity';

@Entity()
export class RecipeEntity {
  @ApiProperty()
  @Index({ unique: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 150 })
  title: string;

  @ApiProperty()
  @Column({ unique: true })
  slug: string;

  @ApiProperty()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ type: String, isArray: true })
  @Column('simple-array')
  images: string[];

  @ApiProperty({ type: RecipeIngredientUnitEntity, isArray: true })
  @OneToMany(() => RecipeIngredientUnitEntity, unit => unit.recipe)
  ingredients: RecipeIngredientUnitEntity[];

  @ApiProperty({ type: RecipeStepEntity, isArray: true })
  @OneToMany(() => RecipeStepEntity, step => step.recipe)
  steps: RecipeStepEntity[];

  @ApiProperty({ type: UserEntity })
  @Transform(({ value }: { value: UserEntity }) => {
    delete value.email;
    delete value.isEmailVerified;
    return value;
  })
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Exclude()
  @Column({ nullable: false })
  userId: string;

  @ApiProperty()
  @Column({ default: false })
  isDeleted: boolean;

  @ApiProperty({ description: 'Опубликован ли рецепт' })
  @Column({ default: false })
  isPublished: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty()
  @UpdateDateColumn()
  updateAt: string;

  @ApiProperty()
  countInBookmarks: number;
}
