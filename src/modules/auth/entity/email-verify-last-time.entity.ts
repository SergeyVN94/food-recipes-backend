import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

// хранит время последней попытки отправки письма с подтверждением
@Entity()
export class EmailVerifyLastTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email: string;

  @Column()
  lastTime: string;

  @CreateDateColumn()
  createdAt: string;
}
