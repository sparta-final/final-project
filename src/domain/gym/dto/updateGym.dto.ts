import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { GymType } from 'src/global/entities/common/enums';

export class UpdateGymDto {
  @ApiProperty({ example: '스파르타 헬스장', description: '헬스장 이름', required: false })
  @IsString()
  name: string;

  @ApiProperty({ example: '010-1234-5678', description: '헬스장 전화번호', required: false })
  @IsPhoneNumber('KR')
  phone: string;

  @ApiProperty({ example: '03253', description: '헬스장 우편번호', required: false })
  @IsString()
  zipCode: string;

  @ApiProperty({ example: '서울시 강남구 테헤란로 427', description: '헬스장 주소', required: false })
  @IsString()
  address: string;

  @ApiProperty({ example: '201호', description: '헬스장 상세주소', required: false })
  @IsString()
  addressDetail: string;

  @ApiProperty({ example: '헬스장', description: '체육관 유형', required: false })
  @IsString()
  gymType: GymType;

  @ApiProperty({ example: '아주 좋은 헬스장입니다~', description: '헬스장 설명', required: false })
  @IsString()
  description: string;

  @ApiProperty({ example: '1234', description: '비밀먼호 확인', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: 'string', format: 'binary', description: '사업자등록증 파일 이름', required: false })
  certification: string;

  @ApiProperty({ type: 'string', format: 'binary', description: '이미지 파일 이름', required: false })
  img: string;
}
