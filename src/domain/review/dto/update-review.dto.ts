import { PickType } from '@nestjs/swagger';
import { Reviews } from 'src/global/entities/Reviews';

export class UpdateReviewDto extends PickType(Reviews, ['review', 'star', 'img']) {}
