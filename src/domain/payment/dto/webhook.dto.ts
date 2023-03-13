import { PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Payments } from 'src/global/entities/Payments';

export class WebhookDto {
  imp_uid: string;
  merchant_uid: string;
  status: string;
}
