import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payments } from '../../global/entities/Payments';
import axios from 'axios';
import { WebhookDto } from './dto/webhook.dto';

@Injectable()
export class PaymentService {
  constructor(@InjectRepository(Payments) private paymentRepo: Repository<Payments>) {}
  /**
   * @description 아임포트 액세스 토큰(access token) 발급 받기
   * @author 한정훈
   */
  async getToken() {
    const token = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post', // POST method
      headers: { 'Content-Type': 'application/json' },
      data: {
        imp_key: process.env.IMP_REST_API_KEY, // REST API 키
        imp_secret: process.env.IMP_REST_API_SECRET_KEY, // REST API Secret
      },
    });
    return token;
  }

  /**
   * @description imp_uid로 포트원 서버에서 결제 정보 조회
   * @author 한정훈
   * @argument imp_uid
   * @argument access_token
   */
  async getPaymentData(imp_uid, access_token) {
    const PaymentData = await axios({
      // imp_uid 전달
      url: `https://api.iamport.kr/payments/${imp_uid}`,
      // GET method
      method: 'get',
      // 인증 토큰 Authorization header에 추가
      headers: { Authorization: access_token },
      data: {
        imp_uid: imp_uid,
      },
    });
    return PaymentData;
  }

  /**
   * @description DB에 결제정보 저장
   * @author 한정훈
   * @argument user_id
   * @argument imp_uid
   * @argument customer_uid
   * @argument merchant_uid
   * @argument amount
   */
  createPaymentData(data: WebhookDto, customer_uid: string, amount: number) {
    this.paymentRepo.insert({
      userId: 1,
      impUid: data.impUid,
      merchantUid: data.merchantUid,
      status: data.status,
      customerUid: customer_uid,
      amount: amount,
    });
  }

  /**
   * @description DB에서 결제되어야 하는 금액 조회
   * @author 한정훈
   * @argument merchant_uid
   */
  async amountToBePaid(merchant_uid: string) {
    const order = await this.paymentRepo.findOne({
      where: { merchantUid: merchant_uid, deletedAt: null },
      select: ['amount'],
    });
    return order;
  }

  /**
   * @description 새로운 결제 예약
   * @author 한정훈
   * @argument access_token
   * @argument paymentData
   */
  async paymentReserve(access_token, paymentData) {
    try {
      const now = Math.floor(new Date().getTime() / 1000);
      const schedule_at_time = Math.floor(new Date().getTime() / 1000) + 60;
      console.log('✨✨✨', '결제시간', new Date(now * 1000), '✨✨✨');
      console.log('✨✨✨', '다음 결제시간', new Date(schedule_at_time * 1000), '✨✨✨');
      console.log('✨✨✨', 'schedule_at_time', schedule_at_time, '✨✨✨');
      const paymentReserve = await axios({
        url: `https://api.iamport.kr/subscribe/payments/schedule`,
        method: 'post',
        headers: { Authorization: access_token },
        data: {
          // 카드(빌링키)와 1:1로 대응하는 값
          customer_uid: paymentData.customer_uid,
          schedules: [
            {
              // 주문 번호
              merchant_uid: `${paymentData.name}_id_${schedule_at_time}`,
              // 결제 시도 시각 in Unix Time Stamp.
              schedule_at: schedule_at_time,
              currency: 'KRW',
              amount: paymentData.amount,
              name: paymentData.name,
              buyer_name: paymentData.buyer_name,
              buyer_tel: paymentData.buyer_tel,
              buyer_email: paymentData.buyer_email,
              notice_url: `https://063b-61-78-119-93.jp.ngrok.io/api/payment/webhook`,
            },
          ],
        },
      });
      return paymentReserve;
    } catch (e) {
      throw new NotFoundException(`스케줄 예약에 실패하였습니다. ${e}`);
    }
  }

  /**
   * @description 구독 취소 (다음달 부터)
   * @author 한정훈
   * @argument customer_uid
   */
  async unsubscribe(customer_uid) {
    try {
      axios({
        url: 'https://063b-61-78-119-93.jp.ngrok.io/payment/unschedule',
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: {
          customer_uid: customer_uid,
        },
      });
    } catch (e) {
      throw new NotFoundException(`스케줄 예약에 실패하였습니다. ${e}`);
    }
  }
}