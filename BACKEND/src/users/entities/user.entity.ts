import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../../roles/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  userName: string;

  @Column()
  userLastname: string;

  @Column({ unique: true })
  userEmail: string;

  @Column()
  usersPassword: string;

  @Column({ type: 'date' })
  userBirthdate: Date;

  @Column({
    type: 'text',
    default: UserRole.USER
  })
  userRole: UserRole;

  @CreateDateColumn()
  userCreatedAt: Date;

  @UpdateDateColumn()
  userUpdatedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  userLastlogin: Date | null;

  @Column({ type: 'boolean' })
  userIsadult: boolean;

  @Column({ default: 'safe' })
  userContentFilter: string;

  @Column({ type: 'datetime' })
  userAcceptedPolicy: Date;
}
