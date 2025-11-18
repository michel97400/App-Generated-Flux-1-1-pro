import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async saveImage(userId: string, url: string, prompt: string, theme?: string, size?: string): Promise<Image> {
    const image = this.imageRepository.create({
      userId,
      imageUrl: url,
      imagePrompt: prompt,
      imageTheme: theme,
      imageSize: size,
    });
    return this.imageRepository.save(image);
  }

  async getUserImages(userId: string): Promise<Image[]> {
    return this.imageRepository
      .createQueryBuilder('image')
      .select(['image.imageId', 'image.imageUrl', 'image.imagePrompt', 'image.imageTheme', 'image.imageSize', 'image.imageCreatedAt'])
      .where('image.userId = :userId', { userId })
      .orderBy('image.imageCreatedAt', 'DESC')
      .getMany();
  }

  async deleteUserImage(imageId: string, userId: string): Promise<void> {
    // First check if the image belongs to the user
    const image = await this.imageRepository.findOne({
      where: { imageId },
    });
    if (!image || image.userId !== userId) {
      throw new Error('Image not found or not owned by user');
    }
    await this.imageRepository.delete(imageId);
  }
}