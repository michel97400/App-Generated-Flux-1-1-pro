import { UserRole } from '../../roles/entities/role.entity';

export class User {
  userId: string;
  userName: string;
  userLastname: string;
  userEmail: string;
  usersPassword: string;
  userBirthdate: Date;
  userRole: UserRole;
  userCreatedAt: Date;
  userUpdatedAt: Date;
  userLastlogin: Date | null;
  userIsadult: Boolean;
  userContentFilter:string;
  userAcceptedPolicy:Date;
}
