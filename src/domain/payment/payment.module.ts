import { Users } from './../../global/entities/Users';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payments } from './../../global/entities/Payments';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Payments, Users])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
