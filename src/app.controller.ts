import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Query, Render, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Public } from './global/common/decorator/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './global/common/decorator/current-user.decorator';
import { JwtPayload } from './domain/auth/types/jwtPayload.type';

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

  @Get()
  @Public()
  @Render('index')
  async home() {
    return;
  }

  // 마이페이지 백업
  @Get('mypage')
  @Public()
  @Render('mypage')
  async mypage() {
    return;
  }

  @Get('myinfo')
  @Public()
  @Render('myinfo')
  async myinfo() {
    return;
  }
}
