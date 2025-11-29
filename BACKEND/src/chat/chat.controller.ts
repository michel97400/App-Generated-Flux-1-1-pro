import { Controller, Post, Body, UseGuards, Get, Query, Delete, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @GetUser() user: User, 
    @Body('message') message: string,
    @Body('conversationId') conversationId?: string
  ): Promise<{ response: string }> {
    console.log('💬 [ChatController] sendMessage appelé');
    console.log('👤 User:', user?.userId || 'undefined');
    console.log('📝 Message:', message?.substring(0, 50) + '...');
    console.log('🆔 ConversationId:', conversationId || 'default');
    try {
      const response = await this.chatService.sendMessage(user.userId, message, conversationId || 'default');
      return { response };
    } catch (error) {
      // Log détaillé pour debug Render
      console.error('❌ Erreur dans ChatController.sendMessage:', error);
      if (error instanceof Error) {
        return { response: `Erreur: ${error.message}` };
      }
      return { response: 'Erreur inconnue dans ChatController' };
    }
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@GetUser() user: User, @Query('conversationId') conversationId?: string) {
    return this.chatService.getUserChatHistory(user.userId, conversationId);
  }

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  async getConversations(@GetUser() user: User) {
    return this.chatService.getUserConversations(user.userId);
  }

  @Delete('conversation/:conversationId')
  @UseGuards(JwtAuthGuard)
  async deleteConversation(@GetUser() user: User, @Param('conversationId') conversationId: string) {
    return this.chatService.deleteConversation(user.userId, conversationId);
  }
}