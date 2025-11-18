import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('my-images')
  @UseGuards(JwtAuthGuard)
  async getMyImages(@GetUser() user: User) {
    return this.imagesService.getUserImages(user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteImage(@Param('id') imageId: string, @GetUser() user: User) {
    await this.imagesService.deleteUserImage(imageId, user.userId);
    return { message: 'Image deleted successfully' };
  }
}