import { Controller, Get, Delete, Param, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('my-images')
  @UseGuards(JwtAuthGuard)
  async getMyImages(@GetUser() user: User) {
    console.log('📋 [ImagesController] getMyImages appelé pour user:', user.userId);
    try {
      const images = await this.imagesService.getUserImages(user.userId);
      console.log('✅ [ImagesController] Images trouvées:', images.length);
      return images;
    } catch (error) {
      console.error('❌ [ImagesController] Erreur lors de la récupération des images:', error);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteImage(@Param('id') imageId: string, @GetUser() user: User) {
    console.log('🗑️ [ImagesController] deleteImage appelé pour imageId:', imageId);
    await this.imagesService.deleteUserImage(imageId, user.userId);
    return { message: 'Image deleted successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  async downloadImage(@Param('id') imageId: string, @GetUser() user: User, @Res() res: Response) {
    console.log('⬇️ [ImagesController] downloadImage appelé pour imageId:', imageId, 'user:', user?.userId || 'no user');
    try {
      const image = await this.imagesService.getImageById(imageId);
      if (!image) {
        console.log('❌ Image non trouvée en base');
        return res.status(404).json({ message: 'Image not found' });
      }
      
      // Vérifier l'accès si user existe (guard désactivé temporairement)
      if (user && image.userId !== user.userId) {
        console.log('❌ Accès refusé - image appartient à un autre user');
        return res.status(403).json({ message: 'Access denied' });
      }

      console.log('📋 Image trouvée en base:', {
        imageId: image.imageId,
        imageUrl: image.imageUrl,
        userId: image.userId
      });

      // Le nom du fichier est directement le nom du fichier dans l'URL
      // Format attendu: http://localhost:3000/uploads/filename.png
      const urlParts = image.imageUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      
      console.log('📁 Nom de fichier extrait:', filename);

      // Chemin complet du fichier
      const filePath = path.join(process.cwd(), 'uploads', filename);
      console.log('📂 Chemin complet:', filePath);

      // Vérifier si le fichier existe
      if (!fs.existsSync(filePath)) {
        console.log('❌ Fichier non trouvé sur le disque');
        
        // Lister les fichiers disponibles pour debug
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (fs.existsSync(uploadDir)) {
          const files = fs.readdirSync(uploadDir);
          console.log('📋 Fichiers disponibles dans uploads:', files);
        }
        
        return res.status(404).json({ message: 'File not found on disk' });
      }

      // Obtenir les informations du fichier
      const stats = fs.statSync(filePath);
      console.log('📊 Informations du fichier:', {
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2),
        isFile: stats.isFile(),
        modified: stats.mtime
      });

      if (stats.size < 10000) { // Moins de 10KB - probablement corrompu
        console.log('❌ Fichier trop petit, probablement corrompu');
        return res.status(500).json({ message: 'File appears to be corrupted or too small' });
      }

      // Définir les headers et envoyer le fichier
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': stats.size,
        'Cache-Control': 'no-cache'
      });

      console.log('✅ Envoi du fichier...');
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.on('error', (error) => {
        console.error('❌ Erreur lors de la lecture du fichier:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error reading file' });
        }
      });

      fileStream.on('end', () => {
        console.log('✅ Fichier envoyé avec succès');
      });

      fileStream.pipe(res);

    } catch (error) {
      console.error('❌ Erreur générale lors du téléchargement:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Internal server error during download' });
      }
    }
  }
}