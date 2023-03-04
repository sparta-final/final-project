import { WebhookDto } from './dto/webhook.dto';
import { PaymentDto } from './dto/payment.dto';
import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Render } from '@nestjs/common';
import { PaymentService } from './payment.service';
import axios from 'axios';
import { Public } from 'src/global/common/decorator/public.decorator';

@Controller('api/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Get()
  @Public()
  @Render('payment')
  async view() {
    return;
  }

  @Post('/complete')
  @Public()
  async complete(@Body() data: PaymentDto) {
    try {
      // 액세스 토큰(access token) 발급 받기
      const getToken = await this.paymentService.getToken();
      const { access_token } = getToken.data.response; // 인증 토큰

      // imp_uid로 포트원 서버에서 결제 정보 조회
      const getPaymentData = await this.paymentService.getPaymentData(data.imp_uid, access_token);
      const paymentData = getPaymentData.data.response; // 조회한 결제 정보

      if (paymentData.status === 'paid') {
        // 결제 성공적으로 완료
        const createPaymentData = this.paymentService.createPaymentData(
          data.imp_uid,
          paymentData.customer_uid,
          data.merchant_uid,
          paymentData.amount
        );
        const paymentReserve = await this.paymentService.paymentReserve(access_token, paymentData);
      } else {
        // 결제금액 불일치. 위/변조 된 결제
        throw new BadRequestException('결제가 승인되지 않았습니다. 다시 시도해 주세요.');
      }
    } catch (e) {
      throw new NotFoundException(`${e}`);
    }
  }

  @Post('/webhook')
  @Public()
  async subscribe(@Body() data: WebhookDto) {
    try {
      const getToken = await this.paymentService.getToken();
      const { access_token } = getToken.data.response;

      const getPaymentData = await this.paymentService.getPaymentData(data.imp_uid, access_token);
      const paymentData = getPaymentData.data.response; // 조회한 결제 정보

      const amountToBePaid = await this.paymentService.amountToBePaid(paymentData.merchant_uid); // 결제 되어야 하는 금액
      if (paymentData.amount === amountToBePaid.amount) {
        const createPaymentData = this.paymentService.createPaymentData(
          data.imp_uid,
          paymentData.customer_uid,
          data.merchant_uid,
          paymentData.amount
        );
        // if (paymentData.status === 'paid') {
        //   // 결제 성공적으로 완료
        // }
      } else {
        //   // 결제금액 불일치. 위/변조 된 결제
        throw { status: 'forgery', message: '위조된 결제시도' };
      }
    } catch (e) {
      throw new NotFoundException(`${e}`);
    }
  }

  // @Post('/schedule')
  // @Public()
  // async schedule(@Body() data: WebhookDto) {
  //   try {
  //     // req의 body에서 imp_uid, merchant_uid 추출
  //     // console.log('✨✨✨', 'imp_uid', data.imp_uid, '✨✨✨');
  //     console.log('✨✨✨', '2 data', data, '✨✨✨');
  //     console.log('✨✨✨', '2. merchant_uid', data.merchant_uid, '✨✨✨');
  //     // 액세스 토큰(access token) 발급 받기
  //     const getToken = await axios({
  //       url: 'https://api.iamport.kr/users/getToken',
  //       method: 'post', // POST method
  //       headers: { 'Content-Type': 'application/json' },
  //       data: {
  //         imp_key: process.env.IMP_REST_API_KEY, // REST API 키
  //         imp_secret: process.env.IMP_REST_API_SECRET_KEY, // REST API Secret
  //       },
  //     });
  //     const { access_token } = getToken.data.response; // 인증 토큰

  //     // imp_uid로 포트원 서버에서 결제 정보 조회
  //     const getPaymentData = await axios({
  //       // imp_uid 전달
  //       url: `https://api.iamport.kr/payments/${data.imp_uid}`,
  //       // GET method
  //       method: 'get',
  //       // 인증 토큰 Authorization header에 추가
  //       headers: { Authorization: access_token },
  //       data: {
  //         imp_uid: data.imp_uid,
  //       },
  //     });
  //     const paymentData = getPaymentData.data.response; // 조회한 결제 정보
  //     console.log('✨✨✨', '2 paymentData', paymentData, '✨✨✨');
  //     if (paymentData.status === 'paid') {
  //       // 결제 성공적으로 완료
  //       const schedule_at_time = Math.floor(new Date().getTime() + 10);
  //       // const merchant_uid =
  //       const createPaymentData = this.paymentService.createPaymentData(
  //         data.imp_uid,
  //         paymentData.customer_uid,
  //         data.merchant_uid,
  //         paymentData.amount
  //       );
  //       const getBillingKey = await axios({
  //         url: `https://api.iamport.kr/subscribe/payments/schedule`,
  //         method: 'post',
  //         headers: { Authorization: access_token },
  //         data: {
  //           customer_uid: paymentData.customer_uid, // 카드(빌링키)와 1:1로 대응하는 값
  //           schedules: [
  //             {
  //               merchant_uid: `${paymentData.name}_id_${schedule_at_time}`, // 주문 번호
  //               schedule_at: schedule_at_time, // 결제 시도 시각 in Unix Time Stamp. 2분 뒤
  //               amount: paymentData.amount,
  //               name: paymentData.name,
  //               buyer_name: paymentData.buyer_name,
  //               buyer_tel: paymentData.buyer_tel,
  //               buyer_email: paymentData.buyer_email,
  //               notice_url: `https://4a95-61-78-119-93.jp.ngrok.io/api/payment/webhook`,
  //             },
  //           ],
  //         },
  //       });
  //       console.log('✨✨✨', 'getBillingKey', getBillingKey, '✨✨✨');
  //     }

  //     // DB에서 결제되어야 하는 금액 조회
  //     // const amountToBePaid = await this.paymentService.amountToBePaid(data.merchant_uid); // 결제 되어야 하는 금액
  //     // console.log('✨✨✨', 'amountToBePaid', amountToBePaid, '✨✨✨');

  //     // const amountToBePaid = order.amount; // 결제 되어야 하는 금액
  //     // 결제 검증하기
  //     // const { amount, status } = paymentData;
  //     // 결제금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
  //     // if (amount === amountToBePaid) {
  //     // DB에 결제 정보 저장
  //     // await Orders.findByIdAndUpdate(merchant_uid, { $set: paymentData });
  //     // switch (status) {
  //     // case "ready": // 가상계좌 발급
  //     //   // DB에 가상계좌 발급 정보 저장
  //     //   const { vbank_num, vbank_date, vbank_name } = paymentData;
  //     //   await Users.findByIdAndUpdate("/* 고객 id */", { $set: { vbank_num, vbank_date, vbank_name }});
  //     //   // 가상계좌 발급 안내 문자메시지 발송
  //     //   SMS.send({ text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num} ${vbank_date} ${vbank_name}`});
  //     //   res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
  //     //   break;
  //     //   case "paid": // 결제 완료
  //     //     res.send({ status: "success", message: "일반 결제 성공" });
  //     //     break;
  //     // }
  //     // } else {
  //     //   // 결제금액 불일치. 위/변조 된 결제
  //     //   throw { status: 'forgery', message: '위조된 결제시도' };
  //     // }
  //   } catch (e) {
  //     throw new NotFoundException(`${e}`);
  //   }
  // }
}
