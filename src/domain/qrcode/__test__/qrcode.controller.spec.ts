import { Test, TestingModule } from '@nestjs/testing';
import { QrcodeController } from '../qrcode.controller';
import { QrcodeService } from '../qrcode.service';

describe('QrcodeController', () => {
  let controller: QrcodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QrcodeController],
      providers: [QrcodeService],
    }).compile();

    controller = module.get<QrcodeController>(QrcodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
