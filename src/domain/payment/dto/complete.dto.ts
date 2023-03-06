import { PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Payments } from 'src/global/entities/Payments';
import { WebhookDto } from './webhook.dto';

export class CompleteDto extends PickType(Payments, ['merchantUid']) {}
