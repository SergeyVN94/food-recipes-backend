import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class AmountTypeEntity {
  @ApiProperty({ required: true })
  @PrimaryGeneratedColumn('increment', {
    type: 'integer',
  })
  id!: number;

  @ApiProperty({ required: true })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ required: true })
  @Column({ unique: true })
  slug: string;

  @ApiProperty({ required: true })
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty({ required: true })
  @UpdateDateColumn()
  updateAt: string;
}
