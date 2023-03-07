import { Gym } from './../../../global/entities/Gym';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MonthDto {
  @ApiProperty({ example: '2023', description: '년도', required: false })
  @IsString()
  year: number;

  @ApiProperty({ example: '03', description: '월', required: false })
  @IsString()
  month: number;
}
