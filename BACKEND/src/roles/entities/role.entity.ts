import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  roleId: string;

  @Column({
    type: 'text',
    unique: true
  })
  roleName: UserRole;

  @Column()
  roleDescription: string;

  @CreateDateColumn()
  roleCreatedAt: Date;

  @UpdateDateColumn()
  roleUpdatedAt: Date;
}
