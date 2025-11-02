import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FluxService } from './flux.service';
import { FluxController } from './flux.controller';

@Module({
  imports: [HttpModule],
  providers: [FluxService],
  controllers: [FluxController],
  exports: [FluxService], // Exporter le service pour l'utiliser dans d'autres modules
})
export class FluxModule {}
