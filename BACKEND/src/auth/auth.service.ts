import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.usersService.validatePassword(password, user.usersPassword)) {
      // Ne pas retourner le mot de passe
      const { usersPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    // Mettre à jour la date de dernière connexion
    await this.usersService.updateLastLogin(user.userId);
    
    // Générer les tokens
    const tokens = await this.generateTokens(user);
    
    return {
      ...tokens,
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

  /**
   * Génère un access token (JWT court) et un refresh token (long)
   */
  async generateTokens(user: User) {
    const payload = { email: user.userEmail, sub: user.userId };
    
    // Access token (15 minutes)
    const access_token = this.jwtService.sign(payload);
    
    // Refresh token (7 jours) - token aléatoire sécurisé
    const refresh_token = crypto.randomBytes(64).toString('hex');
    
    // Sauvegarder le refresh token en base
    await this.saveRefreshToken(user.userId, refresh_token);
    
    return { access_token, refresh_token };
  }

  /**
   * Sauvegarde le refresh token en base de données
   */
  async saveRefreshToken(userId: string, token: string) {
    // Supprimer les anciens tokens de cet utilisateur
    await this.refreshTokenRepository.delete({ userId });
    
    // Créer un nouveau refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 jours
    
    const refreshToken = this.refreshTokenRepository.create({
      userId,
      token,
      expiresAt,
    });
    
    await this.refreshTokenRepository.save(refreshToken);
  }

  /**
   * Valide un refresh token et retourne l'utilisateur associé
   */
  async validateRefreshToken(token: string): Promise<User | null> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token, isRevoked: false },
      relations: ['user'],
    });
    
    if (!refreshToken) {
      return null;
    }
    
    // Vérifier l'expiration
    if (new Date() > refreshToken.expiresAt) {
      await this.refreshTokenRepository.delete({ id: refreshToken.id });
      return null;
    }
    
    return refreshToken.user;
  }

  /**
   * Révoque tous les refresh tokens d'un utilisateur
   */
  async revokeRefreshTokens(userId: string) {
    await this.refreshTokenRepository.update(
      { userId },
      { isRevoked: true }
    );
  }
}
