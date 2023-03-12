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
  @Get('admin/approveDetail')
  @Public()
  @Render('index')
  async adminApproveDetail() {
    return { pageName: 'adminApproveDetail' };
  }

  @Get('enrollfeed')
  @Public()
  @Render('enrollfeed')
  async enrollfeed() {
    return;
  }

  // 헬스장 리스트 페이지
  @Get('gym')
  @Public()
  @Render('index')
  async gymList() {
    return { pageName: 'gymList' };
  }

  // 헬스장 상세 페이지
  @Get('gym/:id')
  @Public()
  @Render('index')
  async gymDetail() {
    return { pageName: 'gymDetail' };
  }

  @Get('postGym')
  @Public()
  @Render('index')
  async postGym() {
    return { pageName: 'postGym' };
  }
  @Get('mypage')
  @Public()
  @Render('index')
  async mypage() {
    return { pageName: 'mypage' };
  }

  @Get('mypage/myinfo')
  @Public()
  @Render('index')
  async myinfo() {
    return { pageName: 'myinfo' };
  }

  @Get('business/businessMyInfo') // 호준님 사업자 기본 페이지
  @Public()
  @Render('index')
  async businessMyInfo() {
    return { pageName: 'businessMyInfo' };
  }
  @Get('updateGym')
  @Public()
  @Render('index')
  async updateGym() {
    return { pageName: 'updateGym' };
  }

  @Get('business/mypageBusiness') // 사업자 회원 정보관련
  @Public()
  @Render('index')
  async mypageBusiness() {
    return { pageName: 'mypageBusiness' };
  }

  @Get('business/myinfoBusiness') // 사업자 회원 수정페이지
  @Public()
  @Render('index')
  async myinfoBusiness() {
    return { pageName: 'myinfoBusiness' };
  }
}
