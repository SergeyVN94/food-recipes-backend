import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from 'src/modules/user';

@Entity()
export class RecipeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  description: string;

  @Column('simple-array')
  ingredients: number[]; 

  @Column('text')
  images: string[];

  @Column('simple-array')
  steps: string[];

  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  userId: UserEntity['id'];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updateAt: string;
}
