import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, UserRole } from './entities/role.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RolesService {
  private roles: Role[] = [];

  constructor() {
    // Initialiser les rôles par défaut
    this.initializeDefaultRoles();
  }

  private initializeDefaultRoles() {
    const defaultRoles: CreateRoleDto[] = [
      { roleName: UserRole.USER, roleDescription: 'Utilisateur standard' },
      { roleName: UserRole.ADMIN, roleDescription: 'Administrateur' },
    ];

    defaultRoles.forEach(dto => {
      this.roles.push({
        roleId: uuid(),
        roleName: dto.roleName,
        roleDescription: dto.roleDescription,
        roleCreatedAt: new Date(),
        roleUpdatedAt: new Date(),
      });
    });
  }

  create(createRoleDto: CreateRoleDto): Role {
    const role: Role = {
      roleId: uuid(),
      roleName: createRoleDto.roleName,
      roleDescription: createRoleDto.roleDescription,
      roleCreatedAt: new Date(),
      roleUpdatedAt: new Date(),
    };
    this.roles.push(role);
    return role;
  }

  findAll(): Role[] {
    return this.roles;
  }

  findOne(id: string): Role | undefined {
    return this.roles.find(role => role.roleId === id);
  }

  findByName(name: UserRole): Role | undefined {
    return this.roles.find(role => role.roleName === name);
  }

  update(id: string, updateRoleDto: UpdateRoleDto): Role | undefined {
    const roleIndex = this.roles.findIndex(role => role.roleId === id);
    if (roleIndex === -1) return undefined;

    this.roles[roleIndex] = {
      ...this.roles[roleIndex],
      ...updateRoleDto,
      roleUpdatedAt: new Date(),
    };

    return this.roles[roleIndex];
  }

  remove(id: string): boolean {
    const roleIndex = this.roles.findIndex(role => role.roleId === id);
    if (roleIndex === -1) return false;

    this.roles.splice(roleIndex, 1);
    return true;
  }
}
