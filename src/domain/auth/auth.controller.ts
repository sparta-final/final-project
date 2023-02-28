import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { PostBusinessUserDto } from './dto/postBusinessUser.dto';
import { PostUserDto } from './dto/postUser.dto';

@ApiTags('AUTH')
@Controller('api/auth')
export class AuthController {
  constructor(private authservice: AuthService) {}
  @ApiOperation({ summary: '일반유저 회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: '회원가입 실패' })
  @Post('user/signup')
  async postUsers(@Body() postuserDto: PostUserDto) {
    const user = await this.authservice.postUsers(postuserDto);
    return user;
  }

  @ApiOperation({ summary: '사업자 회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: '회원가입 실패' })
  @Post('user/business/signup')
  async postBusinessUsers(@Body() postBusinessUserDto: PostBusinessUserDto) {
    const businessUser = await this.authservice.postBusinessUsers(postBusinessUserDto);
    return businessUser;
  }

  @ApiOperation({ summary: '일반유저 로그인' })
  @ApiResponse({ status: 201, description: '로그인 성공' })
  @ApiResponse({ status: 400, description: '로그인 실패' })
  @Post('user/login')
  async userlogin(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const tokens = await this.authservice.userlogin(loginUserDto);
    res.cookie('access_token', tokens.AccessToken, {
      httpOnly: true,
      // secure: true,
    });
    return res.status(200).json({ message: '로그인 성공' });
  }

  // TODO: guard 적용
  @ApiOperation({ summary: '토큰 재발급' })
  @Post('user/refresh')
  async restoreRefreshToken() {
    // TODO: userID : custom decorator 적용, refresh token은 어디서 받아올지? > custom decorator?
    // return this.authservice.refreshToken(dto.)
  }
}
