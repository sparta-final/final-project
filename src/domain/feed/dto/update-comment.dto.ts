import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ example: 'ㅋㅋ', description: '피드 댓글 내용', required: false })
  @IsString()
  comment: string;
}
