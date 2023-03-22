import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class PostBusinessUserDto {
  @ApiProperty({ example: 'sixpack@google.com', description: '사업자 이메일', required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '1234', description: '사업자 비밀번호', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '1234', description: '사업자 비밀번호 확인', required: true })
  @IsString()
  @IsNotEmpty()
  passwordCheck: string;

  @ApiProperty({ example: '010-1234-5678', description: '사업자 전화번호', required: true })
  @IsPhoneNumber('KR')
  phone: string;

  @ApiProperty({ example: '홍길동', description: '사업자 이름', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;
}
