import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, UserRole } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {
    // Initialiser les rôles par défaut
    this.initializeDefaultRoles();
  }

  private async initializeDefaultRoles() {
    const defaultRoles: CreateRoleDto[] = [
      { roleName: UserRole.USER, roleDescription: 'Utilisateur standard' },
      { roleName: UserRole.ADMIN, roleDescription: 'Administrateur' },
    ];

    for (const dto of defaultRoles) {
      const existingRole = await this.roleRepository.findOne({
        where: { roleName: dto.roleName }
      });

      if (!existingRole) {
        const role = this.roleRepository.create({
          roleName: dto.roleName,
          roleDescription: dto.roleDescription,
        });
        await this.roleRepository.save(role);
      }
    }
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Vérifier si le rôle existe déjà
    const existingRole = await this.roleRepository.findOne({
      where: { roleName: createRoleDto.roleName }
    });

    if (existingRole) {
      throw new ConflictException('Role already exists');
    }

    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: string): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: { roleId: id }
    });
  }

  async findByName(name: UserRole): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: { roleName: name }
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { roleId: id }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const result = await this.roleRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }
}
