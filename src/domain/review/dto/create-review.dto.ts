import { PickType } from '@nestjs/swagger';
import { Reviews } from 'src/global/entities/Reviews';

export class CreateReviewDto extends PickType(Reviews, ['review', 'star', 'reviewImg']) {}
