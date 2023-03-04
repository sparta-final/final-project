import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class PostUserDto {
  @ApiProperty({ example: 'sixpack@google.com', description: '일반유저 이메일', required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '1234', description: '일반유저 비밀번호', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '1234', description: '일반유저 비밀번호 확인', required: true })
  @IsString()
  @IsNotEmpty()
  passwordCheck: string;

  @ApiProperty({ example: '010-1234-5678', description: '일반유저 전화번호', required: true })
  @IsPhoneNumber('KR')
  phone: string;

  @ApiProperty({ example: '홍길동', description: '일반유저 이름', required: true })
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
