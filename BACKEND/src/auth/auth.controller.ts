import { Controller, Post, UseGuards, Request, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    // Ne pas retourner le mot de passe
    const { usersPassword, ...result } = user;
    return {
      message: 'User registered successfully',
      user: result,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Request() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(req.user);
    
    // ✅ Définir les cookies httpOnly
    res.cookie('access_token', result.access_token, {
      httpOnly: true,        // Inaccessible via JavaScript
      secure: false,         // true en production avec HTTPS
      sameSite: 'lax',       // Protection CSRF
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    
    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: false,         // true en production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });
    
    // Retourner uniquement les données utilisateur (pas les tokens)
    return {
      message: 'Login successful',
      user: result.user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    
    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No refresh token provided',
      });
    }
    
    // Valider le refresh token
    const user = await this.authService.validateRefreshToken(refreshToken);
    
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid or expired refresh token',
      });
    }
    
    // Générer de nouveaux tokens
    const tokens = await this.authService.generateTokens(user);
    
    // Mettre à jour les cookies
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    return {
      message: 'Tokens refreshed successfully',
      user: {
        userId: user.userId,
        userName: user.userName,
        userLastname: user.userLastname,
        userEmail: user.userEmail,
        userIsadult: user.userIsadult,
        userContentFilter: user.userContentFilter,
      },
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    
    if (refreshToken) {
      // Révoquer le refresh token en base
      const user = await this.authService.validateRefreshToken(refreshToken);
      if (user) {
        await this.authService.revokeRefreshTokens(user.userId);
      }
    }
    
    // Supprimer les cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    return {
      message: 'Logout successful',
    };
  }
}
