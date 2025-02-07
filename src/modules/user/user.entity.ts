import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UserRole } from './types';

@Entity()
export class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Column({ unique: true })
  userName: string;

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
