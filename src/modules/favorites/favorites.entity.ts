import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../user';
import { RecipeEntity, Recipe } from '../recipe';

@Entity()
export class FavoritesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  userId: UserEntity['id'];

  @OneToMany(() => RecipeEntity, (recipe) => recipe.id)
  @JoinColumn()
  recipesId: Recipe['id'][];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updateAt: string;
}
