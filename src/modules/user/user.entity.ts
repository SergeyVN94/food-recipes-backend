import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UserDto } from './dto/user.dto';
import { UserRole } from './types';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isEmailVerified: boolean;

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
      isEmailVerified: this.isEmailVerified,
      createdAt: this.createdAt,
      updateAt: this.updateAt,
    };
  }
}
