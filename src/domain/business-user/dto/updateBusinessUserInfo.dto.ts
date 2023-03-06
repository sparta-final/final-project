import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateBusinessUserInfoDto {
  @ApiProperty({ example: '1234', description: '사업자 유저 현재 비밀번호', required: true })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: '12345', description: '사업자 유저 새로운 비밀번호', required: true })
  @IsString()
  password: string;

  @ApiProperty({ example: '12345', description: '사업자 유저 새로운 비밀번호 확인', required: true })
  @IsString()
  passwordCheck: string;

  @ApiProperty({ example: '010-1234-5679', description: '사업자 유저 전화번호', required: true })
  @IsPhoneNumber('KR')
  phone: string;

  @ApiProperty({ example: '김철수', description: '사업자 유저 이름', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'img', description: '프로필 이미지', required: true })
  @IsString()
  profileImage: string = 'img';
}