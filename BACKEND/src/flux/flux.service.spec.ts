import { Test, TestingModule } from '@nestjs/testing';
import { FluxService } from './flux.service';

describe('FluxService', () => {
  let service: FluxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FluxService],
    }).compile();

    service = module.get<FluxService>(FluxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
