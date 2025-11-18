import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSettings } from './entities/chat-settings.entity.js';
import { CreateChatSettingsDto, UpdateChatSettingsDto } from './dto/chat-settings.dto.js';

@Injectable()
export class ChatSettingsService {
  constructor(
    @InjectRepository(ChatSettings)
    private readonly chatSettingsRepository: Repository<ChatSettings>,
  ) {}

  async create(createChatSettingsDto: CreateChatSettingsDto): Promise<ChatSettings> {
    const settings = this.chatSettingsRepository.create(createChatSettingsDto);
    return await this.chatSettingsRepository.save(settings);
  }

  async findByUserId(userId: string): Promise<ChatSettings | null> {
    return await this.chatSettingsRepository.findOne({
      where: { userId },
    });
  }

  async findOrCreateByUserId(userId: string): Promise<ChatSettings> {
    let settings = await this.findByUserId(userId);
    if (!settings) {
      settings = await this.create({ userId });
    }
    return settings;
  }

  async update(userId: string, updateChatSettingsDto: UpdateChatSettingsDto): Promise<ChatSettings> {
    const settings = await this.findByUserId(userId);
    if (!settings) {
      throw new NotFoundException('Chat settings not found');
    }

    Object.assign(settings, updateChatSettingsDto);
    return await this.chatSettingsRepository.save(settings);
  }

  async delete(userId: string): Promise<void> {
    const result = await this.chatSettingsRepository.delete({ userId });
    if (result.affected === 0) {
      throw new NotFoundException('Chat settings not found');
    }
  }
}