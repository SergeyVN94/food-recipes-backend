import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UserRole } from '../types';
import { BanEntity } from './ban.entity';

@Entity()
export class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Column({ unique: true })
  userName: string;

  @OneToOne(() => BanEntity, ban => ban.user, { nullable: true })
  @JoinColumn({ name: 'banId' })
  ban: BanEntity | null;

  @ApiProperty({ required: false, description: 'Только для своего профиля' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ required: false, description: 'Только для своего профиля' })
  @Column({ default: false })
  isEmailVerified: boolean;

  @Exclude()
  @Column()
  passHash: string;

  @Exclude()
  @Column()
  salt: string;

  @ApiProperty({
    enum: UserRole,
  })
  @Column()
  role: UserRole;

  @ApiProperty()
  @Column({ default: null })
  avatar: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty()
  @UpdateDateColumn()
  updateAt: string;
}
