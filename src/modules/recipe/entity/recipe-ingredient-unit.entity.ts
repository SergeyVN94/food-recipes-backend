import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AmountTypeEntity } from '@/modules/ingredient/entity/amount-types.entity';
import { IngredientEntity } from '@/modules/ingredient/entity/ingredient.entity';

import { RecipeEntity } from './recipe.entity';

@Entity()
export class RecipeIngredientUnitEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Exclude()
  @ManyToOne(() => RecipeEntity, recipe => recipe.ingredients, {
    eager: true,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: RecipeEntity;

  @Exclude()
  @Column({ nullable: true })
  recipeId: string;

  @ApiProperty()
  @Column()
  count: number;

  @Exclude()
  @ManyToOne(() => IngredientEntity)
  @JoinColumn({ name: 'ingredientId' })
  ingredient: IngredientEntity;

  @ApiProperty()
  @Column({ nullable: false })
  ingredientId: number;

  @Exclude()
  @ManyToOne(() => AmountTypeEntity)
  @JoinColumn({ name: 'amountTypeId' })
  amountType: AmountTypeEntity;

  @ApiProperty()
  @Column({ nullable: false })
  amountTypeId: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: string;
}
