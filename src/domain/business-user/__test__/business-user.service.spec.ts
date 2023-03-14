import { Test, TestingModule } from '@nestjs/testing';
import { BusinessUserService } from './business-user.service';

describe('BusinessUserService', () => {
  let service: BusinessUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessUserService],
    }).compile();

    service = module.get<BusinessUserService>(BusinessUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
