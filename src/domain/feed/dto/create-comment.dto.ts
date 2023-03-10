import { PickType } from '@nestjs/swagger';
import { Comments } from 'src/global/entities/Comments';

export class CreateCommentDto extends PickType(Comments, ['comment']) {}
