import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatSettingsService } from './chat-settings.service';
import { CreateChatSettingsDto, UpdateChatSettingsDto } from './dto/chat-settings.dto';
import { ChatSettings } from './entities/chat-settings.entity';

@Controller('chat/settings')
@UseGuards(JwtAuthGuard)
export class ChatSettingsController {
  constructor(private readonly chatSettingsService: ChatSettingsService) {}

  @Get()
  async getSettings(@Request() req): Promise<ChatSettings> {
    return await this.chatSettingsService.findOrCreateByUserId(req.user.userId);
  }

  @Post()
  async createSettings(@Body() createChatSettingsDto: CreateChatSettingsDto): Promise<ChatSettings> {
    return await this.chatSettingsService.create(createChatSettingsDto);
  }

  @Patch()
  async updateSettings(
    @Request() req,
    @Body() updateChatSettingsDto: UpdateChatSettingsDto,
  ): Promise<ChatSettings> {
    console.log('💾 Sauvegarde des paramètres pour user:', req.user.userId, updateChatSettingsDto);
    const result = await this.chatSettingsService.update(req.user.userId, updateChatSettingsDto);
    console.log('✅ Paramètres sauvegardés:', result);
    return result;
  }

  @Delete()
  async deleteSettings(@Request() req): Promise<void> {
    return await this.chatSettingsService.delete(req.user.userId);
  }
}