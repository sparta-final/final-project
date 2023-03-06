import { Controller, Get, Render } from '@nestjs/common';
import { UserService } from './domain/user/user.service';
import { Public } from './global/common/decorator/public.decorator';

@Controller('')
export class AppController {
  userservice: UserService;
  @Get()
  @Public()
  @Render('index')
  async view() {
    return { title: 'Home', message: '메인 페이지 입니다.' };
  }

  @Get('/mypage')
  @Public()
  @Render('mypage')
  async mypage() {
    return { title: 'Mypage', message: '마이 페이지 입니다.' };
  }

  @Get('/myinfo')
  @Public()
  @Render('myinfo')
  async myinfo() {
    const data = await this.userservice.getUserInfo(2);
    console.log(data);
    return { title: 'myinfo', message: '개인정보 수정 페이지 입니다.' };
  }

  @Get('/login')
  @Public()
  @Render('login')
  async login() {
    return { title: 'login', message: '로그인 페이지 입니다.' };
  }
}
