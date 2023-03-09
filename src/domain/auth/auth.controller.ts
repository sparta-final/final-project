import { KakaoLoginUserDto } from './dto/kakaologinUser.dto';
import { Body, Controller, Get, HttpStatus, Post, Redirect, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUserRt } from 'src/global/common/decorator/current-user-at.decorator';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import {
  BusinessUserLogin,
  BusinessUserRefreshToken,
  BusinessUserSignup,
  KakaoLogin,
  Logout,
  UserLogin,
  UserRefreshToken,
  UserSignup,
} from './auth.decorators';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { PostBusinessUserDto } from './dto/postBusinessUser.dto';
import { PostUserDto } from './dto/postUser.dto';
import { JwtPayload } from './types/jwtPayload.type';
import { Public } from 'src/global/common/decorator/public.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('AUTH')
@Controller('api/auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Public()
  @UserSignup()
  @Post('user/signup')
  async postUsers(@Body() postuserDto: PostUserDto) {
    const user = await this.authservice.postUsers(postuserDto);
    return user;
  }

  @Public()
  @BusinessUserSignup()
  @Post('user/business/signup')
  async postBusinessUsers(@Body() postBusinessUserDto: PostBusinessUserDto) {
    const businessUser = await this.authservice.postBusinessUsers(postBusinessUserDto);
    return businessUser;
  }

  @Public()
  @UserLogin()
  @Post('user/login')
  async userlogin(@Body() loginUserDto: LoginUserDto) {
    const tokens = await this.authservice.userlogin(loginUserDto);
    return { at: tokens.AccessToken, rt: tokens.RefreshToken };
  }

  @Public()
  @BusinessUserLogin()
  @Post('user/business/login')
  async businessUserlogin(@Body() loginUserDto: LoginUserDto) {
    const tokens = await this.authservice.businessUserlogin(loginUserDto);
    return { at: tokens.AccessToken, rt: tokens.RefreshToken };
  }

  @Public()
  @UseGuards(AuthGuard('kakao'))
  @KakaoLogin()
  @Get('login/kakao')
  async KakaoLogin() {
    return HttpStatus.OK;
  }

  @Public()
  // @Redirect('/')
  @UseGuards(AuthGuard('kakao'))
  @Get('login/kakao/callback')
  async KakaoLoginCallback(@CurrentUser() user: KakaoLoginUserDto, @Res() res: Response) {
    const tokens = await this.authservice.KakaoLogin(user, res);
    // 토큰 쿼리스트링으로 보내기
    return res.redirect(`http://localhost:3000?at=${tokens.AccessToken}&rt=${tokens.RefreshToken}`);
  }

  @Public()
  @UseGuards(AuthGuard('refresh'))
  @UserRefreshToken()
  @Post('user/refresh')
  async restoreRefreshTokenForUser(@CurrentUser() user: JwtPayload, @CurrentUserRt() rt: string) {
    const tokens = await this.authservice.restoreRefreshTokenForUser(user, rt);
    return { at: tokens.AccessToken, rt: tokens.RefreshToken };
  }

  @Public()
  @UseGuards(AuthGuard('refresh'))
  @BusinessUserRefreshToken()
  @Post('user/business/refresh')
  async restoreRefreshTokenForBusinessUser(@CurrentUser() user: JwtPayload, @CurrentUserRt() rt: string) {
    const tokens = await this.authservice.restoreRefreshTokenForBusinessUser(user, rt);
    return { at: tokens.AccessToken, rt: tokens.RefreshToken };
  }

  @Public()
  @UseGuards(AuthGuard('refresh'))
  @Logout()
  @Post('logout')
  async logout(@CurrentUser() user: JwtPayload, @CurrentUserRt() rt: string) {
    // TODO : 클라이언트에서 로그아웃 요청시, 로컬스토리지에 저장된 토큰 삭제
    return await this.authservice.logout(user, rt);
  }
}
