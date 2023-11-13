import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '../user';

@Entity()
export class RecipeEntity {
  @ApiProperty({ name: 'id', required: true })
  @PrimaryGeneratedColumn('uuid')
  id!: number;

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
  @Column('text')
  images: string[];

  @ApiProperty({ type: String, isArray: true })
  @Column('simple-array')
  steps: string[];

  @ApiProperty()
  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  userId: UserEntity['id'];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty()
  @UpdateDateColumn()
  updateAt: string;
}
