import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
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
}
