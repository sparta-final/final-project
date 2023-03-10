import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Render } from '@nestjs/common';
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

  @Get('user/login')
  @Public()
  @Render('index')
  async userLogin() {
    return { pageName: 'userLogin' };
  }
  @Get('user/signup')
  @Public()
  @Render('index')
  async userSignup() {
    return { pageName: 'userSignup' };
  }

  @Get('user/qrcode')
  @Public()
  @Render('index')
  async userQRCode() {
    return { pageName: 'userQRCode' };
  }

  @Get('business/login')
  @Public()
  @Render('index')
  async businessLogin() {
    return { pageName: 'businessLogin' };
  }

  @Get('business/signup')
  @Public()
  @Render('index')
  async businessSignup() {
    return { pageName: 'businessSignup' };
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
