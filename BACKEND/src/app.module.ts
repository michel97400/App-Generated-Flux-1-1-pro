import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FluxModule } from './flux/flux.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { Image } from './images/entities/image.entity';
import { ImagesModule } from './images/images.module';
import { ChatModule } from './chat/chat.module';
import { Chat } from './chat/entities/chat.entity';
import { ChatSettings } from './chat/entities/chat-settings.entity';


@Module({
  imports: [
    // Configuration globale des variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true, // Rendre disponible partout
      envFilePath: '.env',
    }),
    // Configuration TypeORM avec SQLite
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Role, RefreshToken, Image, Chat, ChatSettings],
      synchronize: true, // ⚠️ À désactiver en production
      logging: true,
    }),
    FluxModule,
    UsersModule,
    AuthModule,
    RolesModule,
    ImagesModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
