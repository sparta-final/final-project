import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class InfinityDto {
  @ApiProperty({ example: 0, description: '불러온 개수', required: false })
  @IsNumber()
  offset: number;

  @ApiProperty({ example: 5, description: '불러올 개수', required: false })
  @IsNumber()
  limit: number;
}
