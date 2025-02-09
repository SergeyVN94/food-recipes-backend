import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UserEntity } from '@/modules/users/entity/user.entity';

import { BookmarkDto } from '../dto/bookmark.dto';

@Entity()
export class BookmarkEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: false })
  userId: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updateAt: string;

  toDto(): BookmarkDto {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      createdAt: this.createdAt,
      updateAt: this.updateAt,
    };
  }
}
