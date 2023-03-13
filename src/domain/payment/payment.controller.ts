import { JwtPayload } from './../auth/types/jwtPayload.type';
import { WebhookDto } from './dto/webhook.dto';
import { CompleteDto } from './dto/complete.dto';
import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from 'src/global/common/decorator/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { CompletePayment, PaidData, UnsubscribePayment, WebhookPayment } from './payment.decorators';
import { Unsubscribable } from 'rxjs';
import { UnsubscribeDto } from './dto/unsubscribe.dto';

@ApiTags('PAYMENT')
@Controller('api/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/complete')
  @CompletePayment()
  @Public()
  async complete(@Body() data: CompleteDto) {
    console.log('✨✨✨', 'complete data', data, '✨✨✨');
    return data;
  }

  @Post('/webhook')
  @WebhookPayment()
  @Public()
  async subscribe(@Body() data: WebhookDto) {
    // user 정보 넘겨줘야함
    try {
      const getToken = await this.paymentService.getToken();
      const { access_token } = getToken.data.response;

      const getPaymentData = await this.paymentService.getPaymentData(data.imp_uid, access_token);
      const paymentData = getPaymentData.data.response; // 조회한 결제 정보
      console.log('✨✨✨', 'paymentData: ', paymentData, '✨✨✨');
      const user_id = Number(paymentData.customer_uid.split('_')[0]);
      if (data.status === paymentData.status && paymentData.status === 'paid') {
        // 결제 성공적으로 완료
        const createPaymentData = this.paymentService.createPaymentData(
          data,
          user_id,
          paymentData.customer_uid,
          paymentData.amount,
          paymentData.card_name,
          paymentData.card_number
        );
        const paymentReserve = await this.paymentService.paymentReserve(access_token, paymentData);
        // console.log('✨✨✨', 'paymentReserve: ', paymentReserve, '✨✨✨');
      } else {
        // 결제금액 불일치. 위/변조 된 결제
        throw new BadRequestException('결제가 승인되지 않았습니다. 다시 시도해 주세요.');
      }
    } catch (e) {
      throw new NotFoundException(`${e}`);
    }
  }

  @Post('/unsubscribe')
  @UnsubscribePayment()
  @Public()
  async unsubscribe(@Body() customer_uid: string) {
    console.log('✨✨✨', customer_uid, '✨✨✨');
    const getToken = await this.paymentService.getToken();
    console.log('✨✨✨', getToken, '✨✨✨');
    const { access_token } = getToken.data.response;
    return await this.paymentService.unsubscribe(customer_uid, access_token);
  }

  @Get('/:id')
  @PaidData()
  async getPaidData(@Param('id') id: string) {
    return await this.paymentService.getPaidData(id);
  }
}
