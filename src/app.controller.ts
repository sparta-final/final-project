import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Render } from '@nestjs/common';
import { Public } from './global/common/decorator/public.decorator';

@ApiTags('RENDER')
@Controller()
export class AppController {
  @Get('qr')
  @Public()
  @Render('qr')
  async view() {
    return { qrCodeUrl: 1 };
  }

  @Get('useGym')
  @Public()
  @Render('useGym')
  async test() {
    return;
  }
  @Get('payment')
  @Public()
  @Render('payment')
  async payment() {
    return;
  }

  @Get('complete')
  @Public()
  @Render('paymentComplete')
  async complete() {
    return;
  }
}
