import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PostUserDto } from './dto/postUser.dto';

@ApiTags('AUTH')
@Controller('api/auth')
export class AuthController {
  constructor(private authservice: AuthService) {}
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: '회원가입 실패' })
  @Post('user/signup')
  async postUsers(@Body() postuserDto: PostUserDto) {
    const user = await this.authservice.postUsers(postuserDto);
    return user;
  }
}
