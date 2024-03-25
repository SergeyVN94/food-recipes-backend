import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../user';
import { RecipeStepEntity } from './recipe-step.entity';
import { RecipeIngredientEntity } from '../recipe-ingredient/recipe-ingredient.entity';

@Entity()
export class RecipeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  description: string;

  @ManyToMany(() => RecipeIngredientEntity)
  @JoinTable()
  ingredients: RecipeIngredientEntity[];

  @Column('simple-array')
  images: string[];

  @OneToMany(() => RecipeStepEntity, (step) => step.recipe)
  steps: RecipeStepEntity[];

  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'userId'
  })
  userId: UserEntity['id'];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updateAt: string;
}
