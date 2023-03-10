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

  @Get('enrollGym')
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

  @Get('postGym')
  @Public()
  @Render('index')
  async postGym() {
    return { pageName: 'postGym' };
  }

  @Get('businessMyInfo')
  @Public()
  @Render('index')
  async businessMyInfo() {
    return { pageName: 'businessMyInfo' };
  }
  @Get('userList')
  @Public()
  @Render('index')
  async userList() {
    return { pageName: 'userList' };
  }
}
