import { ApiProperty, PickType } from '@nestjs/swagger';
import { Feeds } from 'src/global/entities/Feeds';

export class CreateFeedDto extends PickType(Feeds, ['content']) {
  @ApiProperty({ type: 'string', format: 'binary', description: '사진.jpg', required: true })
  image: string;
}
