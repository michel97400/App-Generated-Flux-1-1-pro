import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

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
    origin: '*', // À ajuster en production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Application démarrée sur le port ${port}`);
  logger.log(`📖 Documentation: http://localhost:${port}`);
  logger.log(`🎨 FLUX API: http://localhost:${port}/flux`);
}
bootstrap();
