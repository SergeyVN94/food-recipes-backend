import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RecipeEntity } from './recipe.entity';

@Entity()
export class RecipeStepEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Exclude()
  @ManyToOne(() => RecipeEntity, recipe => recipe.steps, {
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
  order: number;

  @ApiProperty()
  @Column()
  content: string;

  @Exclude()
  @CreateDateColumn()
  createdAt: string;
}
