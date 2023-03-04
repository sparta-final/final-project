import { IsNumber, IsString } from 'class-validator';

export class PaymentDto {
  @IsString()
  readonly imp_uid: string;

  @IsString()
  readonly merchant_uid: string;

  @IsString()
  readonly customer_uid: string;
}
