import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RecipeEntity } from './recipe.entity';

@Entity()
export class RecipeStepEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => RecipeEntity, recipe => recipe.steps, {
    eager: true,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: RecipeEntity;

  @Column({ nullable: true })
  recipeId: string;

  @Column()
  order: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: string;
}
