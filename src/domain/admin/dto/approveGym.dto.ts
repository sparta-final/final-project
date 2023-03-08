import { Gym } from './../../../global/entities/Gym';
import { PickType } from '@nestjs/swagger';

export class ApproveDto extends PickType(Gym, ['isApprove']) {}
