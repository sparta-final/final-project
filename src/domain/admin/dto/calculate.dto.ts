import { Gym } from 'src/global/entities/Gym';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CalculateDto extends PickType(Gym, ['id']) {}
