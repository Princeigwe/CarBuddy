import { Test, TestingModule } from '@nestjs/testing';
import { ExtraFeatureService } from '../services/extra-feature.service';

describe('ExtraFeatureService', () => {
  let service: ExtraFeatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtraFeatureService],
    }).compile();

    service = module.get<ExtraFeatureService>(ExtraFeatureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
