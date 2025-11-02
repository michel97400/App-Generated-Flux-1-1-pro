import { Test, TestingModule } from '@nestjs/testing';
import { FluxController } from './flux.controller';

describe('FluxController', () => {
  let controller: FluxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FluxController],
    }).compile();

    controller = module.get<FluxController>(FluxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
