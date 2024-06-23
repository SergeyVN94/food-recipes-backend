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

import { UserEntity } from '../../user';
import { RecipeStepEntity } from './recipe-step.entity';
import { RecipeIngredientUnitEntity } from './recipe-ingredient-unit.entity';

@Entity()
export class RecipeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', charset: 'utf8mb4' })
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'varchar', charset: 'utf8mb4' })
  description: string;

  @Column('simple-array')
  images: string[];

  @OneToMany(() => RecipeIngredientUnitEntity, (unit) => unit.recipe, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  ingredients: RecipeIngredientUnitEntity[];

  @OneToMany(() => RecipeStepEntity, (step) => step.recipe, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  steps: RecipeStepEntity[];

  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'userId'
  })
  userId: UserEntity['id'];

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updateAt: string;
}
