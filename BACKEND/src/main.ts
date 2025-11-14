import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

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
    origin: 'http://localhost:5174', // URL du frontend Vite
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // ✅ Permet l'envoi des cookies
    allowedHeaders: 'Content-Type, Authorization',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Application démarrée sur le port ${port}`);
  logger.log(`📖 Documentation: http://localhost:${port}`);
  logger.log(`🎨 FLUX API: http://localhost:${port}/flux`);
}
bootstrap();
