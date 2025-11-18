import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  imageId: string;

  @Column()
  imageUrl: string;

  @Column()
  imagePrompt: string;

  @Column({ nullable: true })
  imageTheme: string;

  @Column({ nullable: true })
  imageSize: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  imageCreatedAt: Date;
}