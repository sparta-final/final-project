import { PickType } from '@nestjs/swagger';
import { Payments } from 'src/global/entities/Payments';

export class UnsubscribeDto extends PickType(Payments, ['customerUid']) {}
