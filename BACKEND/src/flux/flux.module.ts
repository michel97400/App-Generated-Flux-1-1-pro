import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FluxService } from './flux.service';
import { FluxController } from './flux.controller';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [HttpModule, ImagesModule],
  providers: [FluxService],
  controllers: [FluxController],
  exports: [FluxService], // Exporter le service pour l'utiliser dans d'autres modules
})
export class FluxModule {}
