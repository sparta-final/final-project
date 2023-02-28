import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CurrentUserRt } from 'src/global/common/decorator/current-user-at.decorator';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { Public } from 'src/global/common/decorator/public.decorator';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { PostBusinessUserDto } from './dto/postBusinessUser.dto';
import { PostUserDto } from './dto/postUser.dto';
import { JwtPayload } from './types/jwtPayload.type';

@ApiTags('AUTH')
@Controller('api/auth')
export class AuthController {
  constructor(private authservice: AuthService) {}
  @ApiOperation({ summary: '일반유저 회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: '회원가입 실패' })
  @Public()
  @Post('user/signup')
  async postUsers(@Body() postuserDto: PostUserDto) {
    const user = await this.authservice.postUsers(postuserDto);
    return user;
  }

  @ApiOperation({ summary: '사업자 회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: '회원가입 실패' })
  @Public()
  @Post('user/business/signup')
  async postBusinessUsers(@Body() postBusinessUserDto: PostBusinessUserDto) {
    const businessUser = await this.authservice.postBusinessUsers(postBusinessUserDto);
    return businessUser;
  }

  @ApiOperation({ summary: '일반유저 로그인' })
  @ApiResponse({ status: 201, description: '로그인 성공' })
  @ApiResponse({ status: 400, description: '로그인 실패' })
  @Public()
  @Post('user/login')
  async userlogin(@Body() loginUserDto: LoginUserDto) {
    const tokens = await this.authservice.userlogin(loginUserDto);
    // TODO: AccessToken만 클라이언트에게 전달 -> 클라이언트에서 RefreshToken을 헤더(authorization)에 저장
    return tokens.AccessToken;
  }

  // TODO: rt guard,strategy는 필요없을까?
  @ApiOperation({ summary: '토큰 재발급' })
  @Post('user/refresh')
  async restoreRefreshToken(@CurrentUser() user: JwtPayload, @CurrentUserRt() rt: string) {
    const tokens = this.authservice.restoreRefreshToken(user.sub, rt);
    // TODO: AccessToken만 클라이언트에게 전달 -> 클라이언트에서 RefreshToken을 헤더(authorization)에 저장
    return (await tokens).AccessToken;
  }
}
