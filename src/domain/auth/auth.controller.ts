import { KakaoLoginUserDto } from './dto/kakaologinUser.dto';
import { Body, Controller, Get, HttpStatus, Post, Redirect, Res, UseGuards, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUserRt } from 'src/global/common/decorator/current-user-rt.decorator';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import {
  AdminLogin,
  BusinessUserLogin,
  BusinessUserSignup,
  KakaoLogin,
  Logout,
  restoreRefreshToken,
  UserLogin,
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
    const tokens = await this.authservice.postUsers(postuserDto);
    return { at: tokens.AccessToken, rt: tokens.RefreshToken, type: 'user' };
  }

  @Public()
  @BusinessUserSignup()
  @Post('user/business/signup')
  async postBusinessUsers(@Body() postBusinessUserDto: PostBusinessUserDto) {
    const tokens = await this.authservice.postBusinessUsers(postBusinessUserDto);
    return { at: tokens.AccessToken, rt: tokens.RefreshToken, type: 'business' };
  }

  @Public()
  @UserLogin()
  @Post('user/login')
  async userlogin(@Body() loginUserDto: LoginUserDto) {
    const tokens = await this.authservice.userlogin(loginUserDto);
    return { at: tokens.AccessToken, rt: tokens.RefreshToken, type: 'user' };
  }

  @Public()
  @BusinessUserLogin()
  @Post('user/business/login')
  async businessUserlogin(@Body() loginUserDto: LoginUserDto) {
    const tokens = await this.authservice.businessUserlogin(loginUserDto);
    return { at: tokens.AccessToken, rt: tokens.RefreshToken, type: 'business' };
  }

  @Public()
  @UseGuards(AuthGuard('kakao'))
  @KakaoLogin()
  @Get('login/kakao')
  async KakaoLogin() {
    return HttpStatus.OK;
  }

  @Public()
  @UseGuards(AuthGuard('kakao'))
  @Get('login/kakao/callback')
  async KakaoLoginCallback(@CurrentUser() user: KakaoLoginUserDto, @Res() res: Response) {
    const tokens = await this.authservice.KakaoLogin(user, res);
    // 토큰 쿼리스트링으로 보내기
    return res.redirect(`https://sixpack.pro?at=${tokens.AccessToken}&rt=${tokens.RefreshToken}`);
  }

  @Public()
  @UseGuards(AuthGuard('refresh'))
  @restoreRefreshToken()
  @Post('user/refresh')
  async restoreRefreshTokenForUser(@CurrentUser() user: JwtPayload, @CurrentUserRt() rt: string) {
    const tokens = await this.authservice.restoreRefreshToken(user, rt);
    return { at: tokens.AccessToken, rt: tokens.RefreshToken };
  }

  @Public()
  @UseGuards(AuthGuard('refresh'))
  @Logout()
  @Post('logout')
  async logout(@CurrentUser() user: JwtPayload, @CurrentUserRt() rt: string) {
    return await this.authservice.logout(user, rt);
  }

  @Public()
  @AdminLogin()
  @Post('admin/login')
  async adminlogin(@Body() loginUserDto: LoginUserDto) {
    const tokens = await this.authservice.adminLogin(loginUserDto);
    return { at: tokens.AccessToken, rt: tokens.RefreshToken, type: 'admin' };
  }
}
