import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Render } from '@nestjs/common';
import { Public } from './global/common/decorator/public.decorator';

@ApiTags('RENDER')
@Controller()
export class AppController {
  @Get('/')
  @Public()
  @Render('index')
  async index() {
    return { pageName: '' };
  }

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
  @Render('index')
  async payment() {
    return { pageName: 'payment' };
  }

  @Get('admin')
  @Public()
  @Render('index')
  async admin() {
    return { pageName: 'admin' };
  }

  @Get('admin/approve')
  @Public()
  @Render('index')
  async adminApprove() {
    return { pageName: 'adminApprove' };
  }

  @Get('complete')
  @Public()
  @Render('paymentComplete')
  async complete() {
    return;
  }

  @Get('map')
  @Public()
  @Render('map')
  async map() {
    return;
    return { KEY: process.env.KAKAO_JAVASCRIPT_KEY };
  }

  @Get('enrollgym')
  @Public()
  @Render('enrollGym')
  async enrollGym() {
    return { KEY: process.env.KAKAO_JAVASCRIPT_KEY };
  }
}
