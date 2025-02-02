import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AmountTypeEntity } from '@/modules/ingredient/entity/amount-types.entity';
import { IngredientEntity } from '@/modules/ingredient/entity/ingredient.entity';

import { RecipeIngredientDto } from '../dto/recipte-ingredient.dto';
import { RecipeEntity } from './recipe.entity';

@Entity()
export class RecipeIngredientUnitEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => RecipeEntity, recipe => recipe.ingredients, {
    eager: true,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: RecipeEntity;

  @Column({ nullable: true })
  recipeId: string;

  @Column()
  count: number;

  @ManyToOne(() => IngredientEntity)
  @JoinColumn({ name: 'ingredientId' })
  ingredient: IngredientEntity;

  @Column({ nullable: false })
  ingredientId: number;

  @ManyToOne(() => AmountTypeEntity)
  @JoinColumn({ name: 'amountTypeId' })
  amountType: AmountTypeEntity;

  @Column({ nullable: false })
  amountTypeId: number;

  @CreateDateColumn()
  createdAt: string;

  toDto(): RecipeIngredientDto {
    return {
      id: this.id,
      count: this.count,
      ingredientId: this.ingredientId,
      amountTypeId: this.amountTypeId,
      createdAt: this.createdAt,
    };
  }
}
