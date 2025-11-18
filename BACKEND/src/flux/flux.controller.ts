import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { FluxService } from './flux.service';
import { GenerateImageDto } from './dto/generate-image.dto';
import { ImagesService } from '../images/images.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('flux')
export class FluxController {
  private readonly logger = new Logger(FluxController.name);

  constructor(
    private readonly fluxService: FluxService,
    private readonly imagesService: ImagesService,
  ) {}

  /**
   * POST /flux/generate-and-save
   * Génère une image et la sauvegarde localement et en base
   */
  @Post('generate-and-save')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async generateAndSave(
    @Body() dto: GenerateImageDto,
    @GetUser() user: User,
  ) {
    this.logger.log(`📥 Requête de génération et sauvegarde reçue pour ${user.userEmail}`);
    const result = await this.fluxService.generateAndSave(dto);

    // Sauvegarder en base de données
    await this.imagesService.saveImage(
      user.userId,
      result.url,
      dto.prompt,
      dto.theme,
      dto.size,
    );

    return result;
  }

  /**
   * POST /flux/generate-file
   * Génère une image et la renvoie directement en tant que fichier PNG téléchargeable
   */
  @Post('generate-file')
  @HttpCode(HttpStatus.OK)
  async generateFile(
    @Body() dto: GenerateImageDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    this.logger.log(`📥 Requête de génération d'image (fichier) reçue`);

    // Générer l'image via le service
    const result = await this.fluxService.generateImage(dto);

    // Récupérer l'image en base64
    const imageBase64 = result.images[0].b64_json;
    if (!imageBase64) {
      throw new Error('Aucune donnée d\'image reçue');
    }

    // Convertir base64 en Buffer
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    // Générer un nom de fichier unique
    const filename = `flux-${Date.now()}.png`;

    // Configurer les headers pour le téléchargement
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': imageBuffer.length,
    });

    this.logger.log(`✅ Image générée et prête au téléchargement: ${filename}`);

    // Retourner le fichier en stream
    return new StreamableFile(imageBuffer);
  }

  /**
   * POST /flux/health
   * Vérifie que le service est opérationnel
   */
  @Post('health')
  @HttpCode(HttpStatus.OK)
  async healthCheck() {
    return {
      status: 'ok',
      service: 'FLUX-1.1-pro',
      timestamp: new Date().toISOString(),
    };
  }
}
