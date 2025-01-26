import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '@/modules/user/user.entity';

import { RecipeDto } from '../dto/recipe.dto';
import { RecipeStepEntity } from './recipe-step.entity';
import { RecipeIngredientUnitEntity } from './recipe-ingredient-unit.entity';

@Entity()
export class RecipeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column('simple-array')
  images: string[];

  @OneToMany(() => RecipeIngredientUnitEntity, (unit) => unit.recipe, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  ingredients: RecipeIngredientUnitEntity[];

  @OneToMany(() => RecipeStepEntity, (step) => step.recipe, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  steps: RecipeStepEntity[];

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: false })
  userId: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updateAt: string;

  toDto(): RecipeDto {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      description: this.description,
      ingredients: this.ingredients.map((ingredient) => ingredient.toDto()),
      images: this.images,
      steps: this.steps,
      user: this.user.toDto(),
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updateAt: this.updateAt,
    };
  }
}
