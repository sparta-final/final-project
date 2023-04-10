import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Render } from '@nestjs/common';
import { Public } from './global/common/decorator/public.decorator';

@ApiTags('RENDER')
@Controller()
// 홈 버튼
export class AppController {
  @Get('/')
  @Public()
  @Render('index')
  async index() {
    return { pageName: '' };
  }

  @Get('payment')
  @Public()
  @Render('index')
  async payment() {
    return { pageName: 'payment' };
  }

  // 어드민 페이지
  @Get('admin/login')
  @Public()
  @Render('index')
  async adminLogin() {
    return { pageName: 'adminLogin' };
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

  @Get('admin/approveDetail/:id')
  @Public()
  @Render('index')
  async adminApproveDetail() {
    return { pageName: 'adminApproveDetail' };
  }

  @Get('admin/calculate')
  @Public()
  @Render('index')
  async calculateAuto() {
    return { pageName: 'calculateAuto' };
  }

  // 로그인 관련
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

  // 피드페이지
  @Get('feed')
  @Public()
  @Render('index')
  async feed() {
    return { pageName: 'feed' };
  }

  @Get('feed/update')
  @Public()
  @Render('index')
  async feedupdate() {
    return { pageName: 'feedUpdate' };
  }

  @Get('feed/create')
  @Public()
  @Render('index')
  async feedCreate() {
    return { pageName: 'feedCreate' };
  }

  @Get('feed/:id/comments')
  @Public()
  @Render('index')
  async comments() {
    return { pageName: 'comments' };
  }

  // 헬스장 페이지
  @Get('gym')
  @Public()
  @Render('index')
  async gymList() {
    return { pageName: 'gymList' };
  }

  @Get('gym/:id')
  @Public()
  @Render('index')
  async gymDetail() {
    return { pageName: 'gymDetail' };
  }

  // 마이페이지 유저
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

  @Get('mypage/history')
  @Public()
  @Render('index')
  async usegymhistory() {
    return { pageName: 'usegymhistory' };
  }

  @Get('mypage/paymentDetails')
  @Public()
  @Render('index')
  async paymentDetails() {
    return { pageName: 'paymentDetails' };
  }

  // 리뷰페이지
  @Get('mypage/review')
  @Public()
  @Render('index')
  async reviewList() {
    return { pageName: 'reviewList' };
  }

  @Get('review/review-detail')
  @Public()
  @Render('index')
  async reviewDetail() {
    return { pageName: 'reviewDetail' };
  }

  @Get('review/postReview')
  @Public()
  @Render('index')
  async postReview() {
    return { pageName: 'postReview' };
  }

  // 마이페이지 사업자
  @Get('business/businessMyInfo')
  @Public()
  @Render('index')
  async businessMyInfo() {
    return { pageName: 'businessMyInfo' };
  }

  @Get('business/updateGym')
  @Public()
  @Render('index')
  async updateGym() {
    return { pageName: 'updateGym' };
  }

  @Get('business/myinfoBusiness')
  @Public()
  @Render('index')
  async myinfoBusiness() {
    return { pageName: 'myinfoBusiness' };
  }

  @Get('business/userList')
  @Public()
  @Render('index')
  async userList() {
    return { pageName: 'userList' };
  }

  @Get('business/gymReview')
  @Public()
  @Render('index')
  async gymReview() {
    return { pageName: 'gymReview' };
  }

  @Get('business/postGym')
  @Public()
  @Render('index')
  async postGym() {
    return { pageName: 'postGym' };
  }

  @Get('searchGym')
  @Public()
  @Render('index')
  async searchGym() {
    return { pageName: 'searchGym' };
  }

  @Get('qrScan')
  @Public()
  @Render('index')
  async qrSacn() {
    return { pageName: 'qrScan' };
  }
}
