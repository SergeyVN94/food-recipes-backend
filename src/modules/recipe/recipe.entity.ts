import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '../user';
import { RecipeStepEntity } from './recipe-step.entity';

@Entity()
export class RecipeEntity {
  @ApiProperty({ name: 'id', required: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ unique: true })
  slug: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty({ type: Number, isArray: true })
  @Column('simple-array')
  ingredients: number[]; 

  @ApiProperty({ type: String, isArray: true })
  @Column('simple-array')
  images: string[];

  @ApiProperty({ type: String, isArray: true })
  @OneToMany(() => RecipeStepEntity, (step) => step.recipe)
  steps: RecipeStepEntity[];

  @ApiProperty()
  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'userId'
  })
  userId: UserEntity['id'];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty()
  @UpdateDateColumn()
  updateAt: string;
}
