import { PartialType } from '@nestjs/swagger';
import { PostGymDto } from './postGym.dto';

export class UpdateGymDto extends PartialType(PostGymDto) {}
