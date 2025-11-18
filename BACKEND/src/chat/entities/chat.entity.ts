import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  chatId: string;

  @Column()
  chatMessage: string;

  @Column()
  chatResponse: string;

  @Column({ default: 'default' })
  conversationId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  chatCreatedAt: Date;
}