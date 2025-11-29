import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
  origin: (origin, callback) => {
    if (
      !origin ||
      origin === 'http://localhost:5173' ||
      origin.startsWith('https://app-generated-flux-1-1-static.onrender.com')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type, Authorization',
});

  // Configuration Swagger pour la documentation API
  const config = new DocumentBuilder()
    .setTitle('FLUX AI API')
    .setDescription('API pour l\'application de génération d\'images avec FLUX AI')
    .setVersion('1.0')
    .addTag('auth', 'Authentification')
    .addTag('users', 'Gestion des utilisateurs')
    .addTag('flux', 'Génération d\'images FLUX')
    .addTag('chat', 'Chat avec Groq AI')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 80;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Application démarrée sur le port ${port}`);
  logger.log(`📖 Documentation API: http://localhost:${port}/api`);
  logger.log(`🎨 FLUX API: http://localhost:${port}/flux`);
}
bootstrap();
