import { Cache } from 'cache-manager';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  CACHE_MANAGER,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Payments } from '../../global/entities/Payments';
import axios from 'axios';
import { WebhookDto } from './dto/webhook.dto';
import { Users } from 'src/global/entities/Users';
import { userMembership } from 'src/global/entities/common/user.membership';
import { CreatePaymentDto } from './dto/createPayment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payments) private paymentRepo: Repository<Payments>,
    @InjectRepository(Users) private userRepo: Repository<Users>,
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
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
  async createPaymentData(data: WebhookDto, user_id: number, paymentData: CreatePaymentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log('결제정보 저장 시작');
      await queryRunner.manager.getRepository(Payments).insert({
        userId: user_id,
        impUid: data.imp_uid,
        merchantUid: data.merchant_uid,
        status: data.status,
        customerUid: paymentData.customer_uid,
        amount: paymentData.amount,
        card_name: paymentData.card_name,
        card_number: paymentData.card_number?.substring(0, 8),
      });
      console.log('결제정보 저장 완료');

      let membershipOptions: userMembership;
      const membershipMap = {
        Basic: userMembership.Basic,
        Standard: userMembership.Standard,
        Premium: userMembership.Premium,
      };
      membershipOptions = membershipMap[paymentData.name];

      await queryRunner.manager
        .getRepository(Users)
        .createQueryBuilder()
        .update()
        .set({ membership: membershipOptions })
        .where('id = :id', { id: user_id })
        .execute();

      const paidDataCaches = await this.cacheManager.store.keys(`paidData:${user_id}`);
      if (paidDataCaches.length > 0) await this.cacheManager.store.del(paidDataCaches);

      const userCaches = await this.cacheManager.store.keys(`user:ID:${user_id}`);
      if (userCaches.length > 0) await this.cacheManager.store.del(userCaches);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('error', error);
      // throw new HttpException('결제정보 저장 실패', HttpStatus.BAD_REQUEST);
      throw new BadRequestException('결제정보 저장 실패');
    } finally {
      await queryRunner.release();
    }
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
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const schedule_at_time = Math.floor(new Date().getTime() / 1000) + 60; // 다음달 1일
      // const schedule_at_time = Math.floor(new Date(y, m, 2).getTime() / 1000); // 다음달 1일

      let paymentAmount = 0;

      if (paymentData.name === 'Basic') {
        paymentAmount = 100000;
      } else if (paymentData.name === 'Standard') {
        paymentAmount = 200000;
      } else if (paymentData.name === 'Premium') {
        paymentAmount = 300000;
      }

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
              merchant_uid: `${paymentData.name}_${paymentData.buyer_email}_${schedule_at_time}`,
              // 결제 시도 시각 in Unix Time Stamp.
              schedule_at: schedule_at_time,
              currency: 'KRW',
              amount: paymentAmount,
              name: paymentData.name,
              buyer_name: paymentData.buyer_name,
              buyer_tel: paymentData.buyer_tel,
              buyer_email: paymentData.buyer_email,
              notice_url: `${process.env.SIXPACK_URL}/api/payment/webhook`,
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
  async unsubscribe(customer_uid, access_token) {
    try {
      const subCancel = await axios({
        url: `https://api.iamport.kr/subscribe/payments/unschedule`,
        method: 'post',
        headers: { 'Content-Type': 'application/json', Authorization: access_token },
        data: {
          customer_uid: customer_uid.customer_uid,
        },
      });
      if (subCancel.data.code === 0) {
        return { message: '구독취소에 성공하였습니다.' };
      } else {
        return { message: '구독취소 신청이 완료되었습니다.' };
      }
    } catch (e) {
      throw new NotFoundException(`구독취소에 실패하였습니다. ${e}`);
    }
  }

  /**
   * @description 구독 취소 후 멤버쉽 변경
   * @argument userId
   */
  async updateMembershipAfterUnsubscribe(userId: number) {
    await this.userRepo.createQueryBuilder().update().set({ membership: null }).where('id = :id', { id: userId }).execute();
    return { message: '멤버쉽 변경에 성공하였습니다.' };
  }

  /**
   * @description 구독 취소 한 회원 확인
   * @argument userId
   */
  async updateWaitCancel(userId: number) {
    const getMyPaid = await this.paymentRepo.findOne({
      where: { userId: userId },
      select: ['id'],
      order: { id: 'DESC' },
    });
    await this.paymentRepo.update(getMyPaid.id, {
      cancel: 1,
    });

    // paidData 캐시 삭제
    const paidDataCaches = await this.cacheManager.store.keys(`paidData:${userId}`);
    if (paidDataCaches.length > 0) await this.cacheManager.store.del(paidDataCaches);

    return { message: '구독취소에 성공하였습니다.' };
  }

  /**
   * @description 내 결제정보 & 내역 가져오기
   * @author 한정훈
   * @argument id
   */
  async getPaidData(id) {
    const cachedpaidData = await this.cacheManager.get(`paidData:${id}`);
    if (cachedpaidData) return cachedpaidData;

    const paidData = await this.paymentRepo.find({
      where: { userId: id },
      order: { id: 'DESC' },
    });
    await this.cacheManager.set(`paidData:${id}`, paidData, { ttl: 60 });
    return paidData;
  }
}
