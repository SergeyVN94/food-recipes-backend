import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RecipeEntity } from './recipe.entity';

@Entity()
export class RecipeStepEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.steps)
  recipe: RecipeEntity;

  @Column()
  order: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updateAt: string;
}
