export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export class Role {
  roleId: string;
  roleName: UserRole;
  roleDescription: string;
  roleCreatedAt: Date;
  roleUpdatedAt: Date;
}
