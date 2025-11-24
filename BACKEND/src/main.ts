import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  // Servir les fichiers statiques depuis le dossier uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  // Activer le parsing des cookies
  app.use(cookieParser());

  // Activer la validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non définies dans le DTO
      forbidNonWhitelisted: true, // Renvoie une erreur si des propriétés non autorisées sont présentes
      transform: true, // Transforme automatiquement les types
    }),
  );

  // Activer CORS pour le frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'https://goodpicsbackend.internal.livelybeach-51c2e15c.westeurope.azurecontainerapps.io'], // URLs du frontend dev et prod
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // ✅ Permet l'envoi des cookies
    allowedHeaders: 'Content-Type, Authorization',
  });

  const port = process.env.PORT ?? 80;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Application démarrée sur le port ${port}`);
  logger.log(`📖 Documentation: http://localhost:${port}`);
  logger.log(`🎨 FLUX API: http://localhost:${port}/flux`);
}
bootstrap();
