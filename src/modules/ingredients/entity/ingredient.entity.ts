import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { AmountTypeEntity } from './amount-types.entity';

@Entity()
export class IngredientEntity {
  @ApiProperty({ required: true })
  @PrimaryGeneratedColumn('increment', {
    type: 'integer',
  })
  id!: number;

  @ApiProperty({ required: true })
  @Column()
  name: string;

  @ApiProperty({ required: true })
  @Column({ unique: true })
  slug: string;

  @ApiProperty({ required: true })
  @Column({ default: '', length: 300 })
  description: string;

  @ApiProperty({ required: true })
  @Column({ default: '' })
  image: string;

  @ApiProperty({ type: Number, required: true, isArray: true })
  @Transform(({ value }: { value: AmountTypeEntity[] }) => value.map(amountType => amountType.id))
  @ManyToMany(() => AmountTypeEntity)
  @JoinTable()
  amountTypes: AmountTypeEntity[];

  @ApiProperty({ required: true })
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty({ required: true })
  @UpdateDateColumn()
  updateAt: string;
}
