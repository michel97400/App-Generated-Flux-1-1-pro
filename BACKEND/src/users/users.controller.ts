import { Controller, Get, Patch, Delete, Body, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Obtenir tous les utilisateurs (protégé par JWT)
  @UseGuards(JwtAuthGuard)
  @Get('users/all')
  async findAll() {
    const users = await this.usersService.findAll();
    // Ne pas retourner les mots de passe
    return users.map(user => {
      const { usersPassword, ...result } = user;
      return result;
    });
  }

  // Obtenir un utilisateur par ID (protégé par JWT)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // Ne pas retourner le mot de passe
    const { usersPassword, ...result } = user;
    return result;
  }

  // Obtenir le profil de l'utilisateur connecté
  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  async getProfile(@Request() req) {
    const user = await this.usersService.findOne(req.user.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { usersPassword, ...result } = user;
    return result;
  }

  // Mettre à jour un utilisateur (protégé par JWT)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    // Vérifier que l'utilisateur ne peut modifier que son propre profil
    if (req.user.userId !== id) {
      throw new NotFoundException('You can only update your own profile');
    }
    
    const user = await this.usersService.update(id, updateUserDto);
    
    // Ne pas retourner le mot de passe
    const { usersPassword, ...result } = user;
    return result;
  }

  // Supprimer un utilisateur (protégé par JWT)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    // Vérifier que l'utilisateur ne peut supprimer que son propre compte
    if (req.user.userId !== id) {
      throw new NotFoundException('You can only delete your own account');
    }
    
    await this.usersService.remove(id);
    
    return { message: 'User deleted successfully' };
  }
}
