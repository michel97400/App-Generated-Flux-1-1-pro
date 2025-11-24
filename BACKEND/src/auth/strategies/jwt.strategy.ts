import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

export interface JwtPayload {
  sub: string; // userId
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET') || 'your-secret-key-change-in-production';
    console.log('🔐 JWT Strategy initialisée');
    console.log('🔑 JWT Secret présente:', !!secret);
    console.log('🔑 Longueur JWT Secret:', secret.length);
    
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // ✅ Extraire le token depuis le cookie 'access_token'
        (request: Request) => {
          const token = request?.cookies?.access_token;
          console.log('🍪 Token from cookie:', token ? token.substring(0, 20) + '...' : 'null');
          return token;
        },
        // Fallback: Authorization header (pour compatibilité)
        (request: Request) => {
          const authHeader = request?.headers?.authorization;
          console.log('📋 Auth header:', authHeader ? authHeader.substring(0, 20) + '...' : 'null');
          return ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('✅ JWT validé pour user:', payload.sub, payload.email);
    return { userId: payload.sub, email: payload.email };
  }
}
