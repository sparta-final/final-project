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
  @Render('payment')
  async payment() {
    return { pageName: 'payment' };
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

  @Get('enrollfeed')
  @Public()
  @Render('enrollfeed')
  async enrollfeed() {
    return;
  }

  @Get('allGym')
  @Public()
  @Render('allGym')
  async allGym() {
    return;
  }

  @Get('/login')
  @Public()
  @Render('login')
  async login() {
    return;
  }

  @Get('/loginBusiness')
  @Public()
  @Render('loginBusiness')
  async loginBusiness() {
    return;
  }

  @Get('mypage')
  @Public()
  @Render('index')
  async mypage() {
    return { pageName: 'mypage' };
  }

  @Get('mypageBusiness')
  @Public()
  @Render('index')
  async mypageBusiness() {
    return { pageName: 'mypageBusiness' };
  }

  @Get('myinfo')
  @Public()
  @Render('index')
  async myinfo() {
    return { pageName: 'myinfo' };
  }

  @Get('myinfoBusiness')
  @Public()
  @Render('index')
  async myinfoBusiness() {
    return { pageName: 'myinfoBusiness' };
  }
}
