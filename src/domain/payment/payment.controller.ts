import { PaymentDto } from './../auth/dto/payment.dto';
import { Body, Controller, Get, NotFoundException, Post, Render } from '@nestjs/common';
import { PaymentService } from './payment.service';
import axios from 'axios';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Get()
  @Render('payment')
  async view() {
    return;
  }

  @Post('/complete')
  async complete(@Body() data: any) {
    try {
      // req의 body에서 imp_uid, merchant_uid 추출
      const { imp_uid, merchant_uid } = data;
      console.log('✨✨✨', 'imp_uid', imp_uid, '✨✨✨');
      console.log('✨✨✨', 'data.imp_uid', data.imp_uid, '✨✨✨');
      // 액세스 토큰(access token) 발급 받기
      const getToken = await axios({
        url: 'https://api.iamport.kr/users/getToken',
        method: 'post', // POST method
        headers: { 'Content-Type': 'application/json' },
        data: {
          imp_key: process.env.IMP_REST_API_KEY, // REST API 키
          imp_secret: process.env.IMP_REST_API_SECRET_KEY, // REST API Secret
        },
      });
      console.log('✨✨✨', 'getToken', getToken.data, '✨✨✨');
      const { access_token } = getToken.data; // 인증 토큰
      // imp_uid로 포트원 서버에서 결제 정보 조회
      debugger;
      const getPaymentData = await axios({
        // imp_uid 전달
        url: `https://api.iamport.kr/payments/${imp_uid}`,
        // GET method
        method: 'get',
        // 인증 토큰 Authorization header에 추가
        headers: { Authorization: access_token },
      });
      console.log('✨✨✨', 'getPaymentData', getPaymentData, '✨✨✨');
      const paymentData = getPaymentData.data; // 조회한 결제 정보

      // 결제검증단계
      // DB에서 결제되어야 하는 금액 조회 (DB에 등록된 상품)
      // const order = await DB이름.findById(paymentData.merchant_uid);
      // const amountToBePaid = order.amount; // 결제 되어야 하는 금액
      // // 결제 검증하기
      // const { amount, status } = paymentData;
      // // 결제금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
      // if (amount === amountToBePaid) {
      //   await DB이름.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장
      //   // ...
      //   switch (status) {
      //     case "ready": // 가상계좌 발급
      //       // DB에 가상계좌 발급 정보 저장
      //       const { vbank_num, vbank_date, vbank_name } = paymentData;
      //       await Users.findByIdAndUpdate("/* 고객 id */", { $set: { vbank_num, vbank_date, vbank_name }});
      //       // 가상계좌 발급 안내 문자메시지 발송
      //       SMS.send({ text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num} ${vbank_date} ${vbank_name}`});
      //       res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
      //       break;
      //     case "paid": // 결제 완료
      //       res.send({ status: "success", message: "일반 결제 성공" });
      //       break;
      //   }
      // } else { // 결제금액 불일치. 위/변조 된 결제
      //   throw { status: "forgery", message: "위조된 결제시도" };
      // }
    } catch (e) {
      throw new NotFoundException(`${e}`);
    }
  }

  @Post()
  async subscribe(@Body() data: PaymentDto) {
    return this.paymentService.subscribe(data.imp_uid, data.merchant_uid);
  }

  // @Post('/complete')
  // async callBack(@Body() data: any) {
  //   console.log('✨✨✨', 'data:', data, '✨✨✨');
  //   return data;
  // }
}
