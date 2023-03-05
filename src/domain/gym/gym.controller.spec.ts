import { Test, TestingModule } from '@nestjs/testing';
import { GymController } from './gym.controller';

describe('GymController', () => {
  let controller: GymController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GymController],
    }).compile();

    controller = module.get<GymController>(GymController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
