import { Test, TestingModule } from '@nestjs/testing';
import { QrcodeService } from '../qrcode.service';

describe('QrcodeService', () => {
  let service: QrcodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QrcodeService],
    }).compile();

    service = module.get<QrcodeService>(QrcodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
