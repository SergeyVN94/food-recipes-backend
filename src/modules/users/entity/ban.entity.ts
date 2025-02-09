import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UserEntity } from './user.entity';

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
  @OneToOne(() => UserEntity, user => user.ban)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiProperty({ required: true })
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
