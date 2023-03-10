import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { GymType } from 'src/global/entities/common/enums';

export class PostGymDto {
  @ApiProperty({ example: '스파르타 헬스장', description: '헬스장 이름', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '010-1234-5678', description: '헬스장 전화번호', required: true })
  @IsPhoneNumber('KR')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '37.123456', description: '위도', required: true })
  @IsNotEmpty()
  lat: number;

  @ApiProperty({ example: '127.123456', description: '경도', required: true })
  @IsNotEmpty()
  lng: number;

  @ApiProperty({ example: '서울시 강남구', description: '주소', required: true })
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '헬스장, 필라테스, 요가', description: '체육관 유형' })
  @IsString()
  @IsNotEmpty()
  gymType: GymType;

  @ApiProperty({ example: '아주 좋은 헬스장입니다~', description: '헬스장 설명', required: true })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary', description: '사업자등록증 파일 이름', required: true })
  certification: string;

  @ApiProperty({ type: 'string[]', format: 'binary', description: '이미지 파일 이름', required: true })
  img: string;
}
