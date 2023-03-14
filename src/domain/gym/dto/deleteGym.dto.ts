import { PickType } from '@nestjs/swagger';
import { Busienssusers } from 'src/global/entities/Busienssusers';

export class DeleteGymDto extends PickType(Busienssusers, ['password'] as const) {}
