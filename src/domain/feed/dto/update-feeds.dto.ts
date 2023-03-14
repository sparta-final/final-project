import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateFeedDto {
  @ApiProperty({ example: '최고에용', description: '피드 내용', required: false })
  @IsString()
  content: string;

  // @ApiProperty({ type: 'string', format: 'binary', description: '피드 이미지', required: false })
  // image: string;
}
