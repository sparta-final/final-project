import { Test, TestingModule } from '@nestjs/testing';
import { GymService } from './gym.service';

describe('GymService', () => {
  let service: GymService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GymService],
    }).compile();

    service = module.get<GymService>(GymService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
