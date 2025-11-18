import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Chat } from './entities/chat.entity';
import { ChatSettingsService } from './chat-settings.service';

@Injectable()
export class ChatService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    private readonly chatSettingsService: ChatSettingsService,
  ) {}

  async sendMessage(userId: string, message: string, conversationId: string = 'default'): Promise<string> {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    const apiUrl = this.configService.get<string>('GROQ_API_URL');

    // Get user chat settings
    const settings = await this.chatSettingsService.findOrCreateByUserId(userId);
    console.log('🔧 Utilisation des paramètres utilisateur:', {
      model: settings.model,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
      systemPrompt: settings.systemPrompt ? 'Présent' : 'Aucun'
    });

    const messages: Array<{ role: string; content: string }> = [];
    if (settings.systemPrompt) {
      messages.push({ role: 'system', content: settings.systemPrompt });
    }
    messages.push({ role: 'user', content: message });

    const response = await firstValueFrom(
      this.httpService.post(
        `${apiUrl}/chat/completions`,
        {
          model: settings.model,
          messages: messages,
          max_tokens: settings.maxTokens,
          temperature: settings.temperature,
          top_p: settings.topP,
          frequency_penalty: settings.frequencyPenalty,
          presence_penalty: settings.presencePenalty,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    const aiResponse = response.data.choices[0].message.content;

    // Save to database
    await this.chatRepository.save({
      userId,
      chatMessage: message,
      chatResponse: aiResponse,
      conversationId,
    });

    return aiResponse;
  }

  async getUserChatHistory(userId: string, conversationId?: string): Promise<Chat[]> {
    const query = this.chatRepository
      .createQueryBuilder('chat')
      .select(['chat.chatId', 'chat.chatMessage', 'chat.chatResponse', 'chat.conversationId', 'chat.chatCreatedAt'])
      .where('chat.userId = :userId', { userId })
      .orderBy('chat.chatCreatedAt', 'ASC');

    if (conversationId) {
      query.andWhere('chat.conversationId = :conversationId', { conversationId });
    }

    return query.getMany();
  }

  async getUserConversations(userId: string): Promise<any[]> {
    console.log('🔍 Récupération des conversations pour userId:', userId);
    
    const conversations = await this.chatRepository
      .createQueryBuilder('chat')
      .select([
        'chat.conversationId',
        'COUNT(chat.chatId) as messageCount',
        'MAX(chat.chatCreatedAt) as lastMessageDate',
        'MAX(chat.chatMessage) as lastMessage',
        'MIN(chat.chatCreatedAt) as firstMessageDate'
      ])
      .where('chat.userId = :userId', { userId })
      .groupBy('chat.conversationId')
      .orderBy('lastMessageDate', 'DESC')
      .getRawMany();

    console.log('📊 Conversations trouvées:', conversations.length);

    // Pour chaque conversation, récupérer le premier message
    const conversationsWithTitles = await Promise.all(
      conversations.map(async (conv) => {
        const firstMessage = await this.chatRepository.findOne({
          where: {
            userId,
            conversationId: conv.chat_conversationId
          },
          order: { chatCreatedAt: 'ASC' }
        });

        // Générer un titre basé sur le premier message
        let title = 'Nouvelle conversation';
        if (firstMessage) {
          const message = firstMessage.chatMessage;
          // Prendre les premiers mots (max 6 mots) et limiter à 40 caractères
          const words = message.split(' ').slice(0, 6);
          title = words.join(' ');
          if (title.length > 40) {
            title = title.substring(0, 37) + '...';
          }
          console.log('🏷️ Titre généré pour', conv.chat_conversationId, ':', title);
        }

        return {
          id: conv.chat_conversationId,
          title: title,
          lastMessage: conv.lastMessage,
          createdAt: conv.lastMessageDate,
          messageCount: parseInt(conv.messageCount)
        };
      })
    );

    return conversationsWithTitles;
  }

  async deleteConversation(userId: string, conversationId: string): Promise<void> {
    console.log('🗑️ Suppression de la conversation:', conversationId, 'pour userId:', userId);
    
    const result = await this.chatRepository.delete({
      userId,
      conversationId
    });

    console.log('✅ Conversation supprimée, messages supprimés:', result.affected);
  }
}