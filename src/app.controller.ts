import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Query, Render, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Public } from './global/common/decorator/public.decorator';
import { UserService } from './domain/user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './global/common/decorator/current-user.decorator';
import { JwtPayload } from './domain/auth/types/jwtPayload.type';

@ApiTags('RENDER')
@Controller()
export class AppController {
  constructor(private userService: UserService) {}

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
