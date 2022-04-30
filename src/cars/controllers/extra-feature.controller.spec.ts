import { Test, TestingModule } from '@nestjs/testing';
import { ExtraFeatureController } from './extra-feature.controller';

describe('ExtraFeatureController', () => {
  let controller: ExtraFeatureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExtraFeatureController],
    }).compile();

    controller = module.get<ExtraFeatureController>(ExtraFeatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
