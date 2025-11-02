import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { UserRole } from '../entities/role.entity';

export class CreateRoleDto {
  @IsEnum(UserRole)
  @IsNotEmpty()
  roleName: UserRole;

  @IsString()
  @IsNotEmpty()
  roleDescription: string;
}
