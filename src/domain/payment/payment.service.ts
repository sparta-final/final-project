import { PaymentDto } from './../auth/dto/payment.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payments } from '../../global/entities/Payments';

@Injectable()
export class PaymentService {
  constructor(@InjectRepository(Payments) private paymentRepo: Repository<Payments>) {}

  async subscribe(imp_uid: string, merchant_uid: string) {
    console.log('✨✨✨', 'imp_uid: ', imp_uid, '✨✨✨');
    console.log('✨✨✨', 'merchant_uid: ', merchant_uid, '✨✨✨');
  }
}
