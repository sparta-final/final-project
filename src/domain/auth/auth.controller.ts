import { KakaoLoginUserDto } from './dto/kakaologinUser.dto';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUserRt } from 'src/global/common/decorator/current-user-at.decorator';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import {
  BusinessUserLogin,
  BusinessUserRefreshToken,
  BusinessUserSignup,
  KakaoLogin,
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
    // TODO: AccessToken만 클라이언트에게 전달 -> 클라이언트에서 RefreshToken을 헤더(authorization)에 저장
    return tokens.AccessToken;
  }

  @Public()
  @BusinessUserLogin()
  @Post('user/business/login')
  async businessUserlogin(@Body() loginUserDto: LoginUserDto) {
    const tokens = await this.authservice.businessUserlogin(loginUserDto);
    // TODO: AccessToken만 클라이언트에게 전달 -> 클라이언트에서 RefreshToken을 헤더(authorization)에 저장
    return tokens.AccessToken;
  }

  @Public()
  @KakaoLogin()
  @Get('login/kakao')
  async KakaoLogin(@CurrentUser() user: KakaoLoginUserDto, @Res() res: Response) {
    const tokens = await this.authservice.KakaoLogin(user, res);
    return tokens.AccessToken;
  }

  // TODO: rt guard,strategy는 필요없을까?
  @UserRefreshToken()
  @Post('user/refresh')
  async restoreRefreshTokenForUser(@CurrentUser() user: JwtPayload, @CurrentUserRt() rt: string) {
    const tokens = await this.authservice.restoreRefreshTokenForUser(user, rt);
    // TODO: AccessToken만 클라이언트에게 전달 -> 클라이언트에서 RefreshToken을 헤더(authorization)에 저장
    return tokens.AccessToken;
  }

  @BusinessUserRefreshToken()
  @Post('user/business/refresh')
  async restoreRefreshTokenForBusinessUser(@CurrentUser() user: JwtPayload, @CurrentUserRt() rt: string) {
    const tokens = await this.authservice.restoreRefreshTokenForBusinessUser(user, rt);
    // TODO: AccessToken만 클라이언트에게 전달 -> 클라이언트에서 RefreshToken을 헤더(authorization)에 저장
    return tokens.AccessToken;
  }
}
