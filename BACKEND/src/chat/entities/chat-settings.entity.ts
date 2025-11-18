import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('chat_settings')
export class ChatSettings {
  @PrimaryGeneratedColumn('uuid')
  settingsId: string;

  @Column({ type: 'varchar', length: 255, default: 'openai/gpt-oss-20b' })
  model: string;

  @Column({ type: 'text', nullable: true })
  systemPrompt: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.7 })
  temperature: number;

  @Column({ type: 'int', default: 4096 })
  maxTokens: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  topP: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  topK: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  frequencyPenalty: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  presencePenalty: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}