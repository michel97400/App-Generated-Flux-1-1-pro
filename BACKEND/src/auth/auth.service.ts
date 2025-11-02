import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = this.usersService.findByEmail(email);
    if (user && await this.usersService.validatePassword(password, user.usersPassword)) {
      // Ne pas retourner le mot de passe
      const { usersPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    // Mettre à jour la date de dernière connexion
    this.usersService.updateLastLogin(user.userId);
    
    const payload = { email: user.userEmail, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        userId: user.userId,
        userName: user.userName,
        userLastname: user.userLastname,
        userEmail: user.userEmail,
        userIsadult: user.userIsadult,
        userContentFilter: user.userContentFilter,
      }
    };
  }
}
