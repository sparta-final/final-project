import { Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: '회원가입 실패' })
  @ApiBody({ type: 'string' })
  @Post()
  async postUsers() {
    return '123';
  }
}
