import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AmountTypeEntity } from './amount-types.entity';

@Entity()
export class RecipeIngredientEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'integer',
  })
  id!: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: '', length: 300 })
  description: string;

  @Column({ default: '' })
  image: string;

  @ManyToMany(() => AmountTypeEntity)
  @JoinTable()
  amountTypes: AmountTypeEntity[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updateAt: string;
}
