import { ApiProperty } from '@nestjs/swagger';

export class GymImage {
  @ApiProperty({ example: '파일이름.jpg', description: '헬스장 이미지', required: true })
  img: string;
}
