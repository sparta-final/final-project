import { PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Payments } from 'src/global/entities/Payments';

export class WebhookDto extends PickType(Payments, ['impUid', 'merchantUid', 'status']) {}
