import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RecipeEntity } from './recipe.entity';
import { RecipeIngredientEntity } from '../../recipe-ingredient/entity/recipe-ingredient.entity';
import { AmountTypeEntity } from '../../recipe-ingredient/entity/amount-types.entity';

@Entity()
export class RecipeIngredientUnitEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.ingredients)
  recipe: RecipeEntity;

  @Column()
  count: number;

  @OneToOne(() => RecipeIngredientEntity)
  @JoinColumn()
  ingredient: RecipeIngredientEntity;

  @OneToOne(() => AmountTypeEntity)
  @JoinColumn()
  amountType: AmountTypeEntity; 

  @CreateDateColumn()
  createdAt: string;
}
