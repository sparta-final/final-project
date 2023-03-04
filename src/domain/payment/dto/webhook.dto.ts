import { PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { PaymentDto } from './payment.dto';

export class WebhookDto extends PickType(PaymentDto, ['imp_uid', 'merchant_uid']) {
  @IsString()
  readonly status: string;
}
