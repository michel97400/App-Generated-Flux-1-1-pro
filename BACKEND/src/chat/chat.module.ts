import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatSettingsService } from './chat-settings.service';
import { ChatSettingsController } from './chat-settings.controller';
import { Chat } from './entities/chat.entity';
import { ChatSettings } from './entities/chat-settings.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Chat, ChatSettings])],
  controllers: [ChatController, ChatSettingsController],
  providers: [ChatService, ChatSettingsService],
})
export class ChatModule {}