import { Controller, Get, Patch, Delete, Body, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Obtenir tous les utilisateurs (protégé par JWT)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    const users = this.usersService.findAll();
    // Ne pas retourner les mots de passe
    return users.map(user => {
      const { usersPassword, ...result } = user;
      return result;
    });
  }

  // Obtenir un utilisateur par ID (protégé par JWT)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.usersService.findOne(id);
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
  getProfile(@Request() req) {
    const user = this.usersService.findOne(req.user.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { usersPassword, ...result } = user;
    return result;
  }

  // Mettre à jour un utilisateur (protégé par JWT)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    // Vérifier que l'utilisateur ne peut modifier que son propre profil
    if (req.user.userId !== id) {
      throw new NotFoundException('You can only update your own profile');
    }
    
    const user = this.usersService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Ne pas retourner le mot de passe
    const { usersPassword, ...result } = user;
    return result;
  }

  // Supprimer un utilisateur (protégé par JWT)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    // Vérifier que l'utilisateur ne peut supprimer que son propre compte
    if (req.user.userId !== id) {
      throw new NotFoundException('You can only delete your own account');
    }
    
    const deleted = this.usersService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return { message: 'User deleted successfully' };
  }
}
