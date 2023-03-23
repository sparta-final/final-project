import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class InfinityDto {
  @ApiProperty({ example: 0, description: '불러온 개수', required: false })
  @Type(() => Number)
  @IsNumber()
  offset: number;

  @ApiProperty({ example: 5, description: '불러올 개수', required: false })
  @IsNumber()
  limit: number;
}
