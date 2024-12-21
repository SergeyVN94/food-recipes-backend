import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from './types';
import { UserDto } from './dto/user.dto';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passHash: string;

  @Column()
  salt: string;

  @Column()
  role: UserRole;

  @Column({ default: null })
  avatar: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updateAt: string;

  toDto(): UserDto {
    return {
      id: this.id,
      userName: this.userName,
      email: this.email,
      role: this.role,
      avatar: this.avatar,
      createdAt: this.createdAt,
      updateAt: this.updateAt,
    };
  }
}
