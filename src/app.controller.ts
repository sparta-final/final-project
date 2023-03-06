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

  @Get('map')
  @Public()
  @Render('map')
  async map() {
    return { KEY: process.env.KAKAO_JAVASCRIPT_KEY };
  }

  @Get('enrollgym')
  @Public()
  @Render('enrollGym')
  async enrollGym() {
    return { KEY: process.env.KAKAO_JAVASCRIPT_KEY };
  }
}
