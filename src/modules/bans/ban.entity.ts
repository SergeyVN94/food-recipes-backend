import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UserEntity } from '../users/user.entity';

@Entity()
export class BanEntity {
  @ApiProperty({ required: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ required: true })
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'initiatorId' })
  initiator: UserEntity;

  @Exclude()
  @Column({ nullable: true })
  initiatorId: string;

  @Exclude()
  @OneToOne(() => UserEntity, user => user.ban)
  user: UserEntity;

  @Exclude()
  @Column({ nullable: true, type: 'uuid' })
  userId: string;

  @ApiProperty({ required: true, description: 'Дата окончания бана в формате ISO' })
  @Column()
  endDate: string;

  @ApiProperty({ required: true })
  @Column({ nullable: true })
  reason: string;

  @ApiProperty({ required: true })
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty()
  @UpdateDateColumn()
  updateAt: string;
}
