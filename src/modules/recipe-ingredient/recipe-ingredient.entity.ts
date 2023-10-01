import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RecipeIngredientEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: '', length: 300 })
  description: string;

  @Column({ default: '',  })
  image: string;

  @Column('simple-array')
  amountTypes: number[];
}
