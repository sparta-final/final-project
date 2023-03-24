import { Gym } from '../../../global/entities/Gym';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty({ example: '정산 금액', description: '카테고리 이름', required: false })
  @IsString()
  category: string;

  @ApiProperty({ example: '2023', description: '년도', required: false })
  @IsString()
  year: string;

  @ApiProperty({ example: '03', description: '월', required: false })
  @IsString()
  month: string;
}
