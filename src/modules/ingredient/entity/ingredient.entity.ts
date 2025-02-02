import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { IngredientDto } from '../dto/ingredient.dto';
import { AmountTypeEntity } from './amount-types.entity';

@Entity()
export class IngredientEntity {
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

  toDto(): IngredientDto {
    return {
      id: this.id,
      slug: this.slug,
      name: this.name,
      description: this.description,
      amountTypes: this.amountTypes.map(amountType => amountType.id),
      createdAt: this.createdAt,
      updateAt: this.updateAt,
    };
  }
}
