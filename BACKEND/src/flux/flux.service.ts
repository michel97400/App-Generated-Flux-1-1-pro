import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GenerateImageDto } from './dto/generate-image.dto';
import { ImageResponse } from './dto/image-response.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FluxService {
  private readonly logger = new Logger(FluxService.name);
  private readonly endpoint: string;
  private readonly apiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    // Récupération des credentials Azure depuis les variables d'environnement
    const endpoint = this.configService.get<string>('AZURE_FLUX_ENDPOINT');
    const apiKey = this.configService.get<string>('AZURE_FLUX_API_KEY');

    if (!endpoint || !apiKey) {
      throw new Error(
        'Configuration manquante: AZURE_FLUX_ENDPOINT et AZURE_FLUX_API_KEY sont requis',
      );
    }

    this.endpoint = endpoint;
    this.apiKey = apiKey;

    this.logger.log('✅ Service FLUX-1.1-pro initialisé');
    this.logger.log(`🔗 Endpoint: ${this.endpoint.substring(0, 50)}...`);
  }

  /**
   * Génère une ou plusieurs images avec FLUX-1.1-pro
   */
  async generateImage(dto: GenerateImageDto): Promise<ImageResponse> {
    this.logger.log(`🎨 Génération d'image(s) avec FLUX-1.1-pro`);
    this.logger.log(`📝 Prompt: ${dto.prompt.substring(0, 50)}...`);
    this.logger.log(`📐 Taille: ${dto.size}`);

    try {
      // Préparer le payload pour Azure
      const payload = {
        prompt: dto.prompt,
        size: dto.size,
        n: dto.n,
      };

      // Appel à l'API Azure AI Foundry
      const response = await firstValueFrom(
        this.httpService.post(this.endpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
          },
          timeout: 60000, // 60 secondes
        }),
      );

      this.logger.log('✅ Génération réussie!');

      // Formater la réponse
      const result: ImageResponse = {
        created: response.data.created,
        images: response.data.data.map((img: any, idx: number) => ({
          index: idx,
          b64_json: img.b64_json,
          url: img.url,
          revised_prompt: img.revised_prompt || dto.prompt,
        })),
      };

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Génère une image et la sauvegarde localement
   */
  async generateAndSave(
    dto: GenerateImageDto,
    outputPath?: string,
  ): Promise<{ url: string; size: number }> {
    // Générer l'image
    const result = await this.generateImage(dto);

    // Récupérer les données base64
    const imageBase64 = result.images[0].b64_json;

    if (!imageBase64) {
      throw new HttpException(
        'Aucune donnée d\'image base64 reçue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Définir le chemin de sortie
    const finalPath = outputPath || `./uploads/image_${Date.now()}.png`;

    // Créer le dossier si nécessaire
    const dir = path.dirname(finalPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Décoder et sauvegarder l'image
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    fs.writeFileSync(finalPath, imageBuffer);

    const fileSize = fs.statSync(finalPath).size;

    // Générer l'URL pour accéder à l'image
    const filename = path.basename(finalPath);
    const url = `http://localhost:3000/uploads/${filename}`;

    this.logger.log(`💾 Image sauvegardée: ${finalPath}`);
    this.logger.log(`📊 Taille: ${(fileSize / 1024).toFixed(2)} KB`);
    this.logger.log(`🔗 URL: ${url}`);

    return {
      url,
      size: fileSize,
    };
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(error: any): never {
    this.logger.error('❌ Erreur lors de la génération d\'image');

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || error.message;
      const data = error.response.data;

      this.logger.error(`Status: ${status}`);
      this.logger.error(`Message: ${message}`);
      this.logger.error(`Data: ${JSON.stringify(data)}`);

      switch (status) {
        case 401:
          throw new HttpException(
            'Clé API invalide ou expirée',
            HttpStatus.UNAUTHORIZED,
          );
        case 404:
          throw new HttpException(
            'Ressource non trouvée - vérifiez l\'endpoint et le nom du déploiement',
            HttpStatus.NOT_FOUND,
          );
        case 429:
          throw new HttpException(
            'Limite de taux atteinte - réessayez plus tard',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        default:
          throw new HttpException(
            `Erreur Azure: ${message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    } else {
      this.logger.error(`Erreur réseau ou autre: ${error.message}`);
      this.logger.error(`Stack: ${error.stack}`);
      throw new HttpException(
        'Erreur lors de la génération d\'image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
