import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class PostGymDto {
  @ApiProperty({ example: '스파르타 헬스장', description: '헬스장 이름', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '010-1234-5678', description: '헬스장 전화번호', required: true })
  @IsPhoneNumber('KR')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '서울시 강남구 테헤란로 427', description: '헬스장 주소', required: true })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '아주 좋은 헬스장입니다~', description: '헬스장 설명', required: true })
  @IsString()
  @IsNotEmpty()
  description: string;

  // @ApiProperty({ example: '사업자등록증.pdf', description: '사업자등록증 파일 이름', required: true })
  // certification: string;
}
