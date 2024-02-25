import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { RecipeEntity } from './recipe.entity';

@Entity()
export class RecipeStepEntity {
  @ApiProperty({ name: 'id', required: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @ManyToOne(() => RecipeEntity, (recipe) => recipe.steps)
  recipe: RecipeEntity;

  @ApiProperty()
  @Column()
  order: number;

  @ApiProperty()
  @Column()
  content: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty()
  @UpdateDateColumn()
  updateAt: string;
}
