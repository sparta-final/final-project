import { Cache } from 'cache-manager';
import { JwtPayload } from 'src/domain/auth/types/jwtPayload.type';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserGym } from 'src/global/entities/UserGym';
import { Repository } from 'typeorm';
import * as qrcode from 'qrcode';
import { endOfDay, startOfMonth } from 'date-fns';

@Injectable()
export class QRcodeService {
  constructor(
    @InjectRepository(UserGym) private userGymRepo: Repository<UserGym>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  /**
   * @description 유저의 QR코드 생성
   * @author 김승일
   * @argument user
   */
  async createQRcode(user: JwtPayload) {
    const date = Date.now();
    // TODO : QR코드 찍으면 사업자가 유저정보 보고 이용기록 저장
    const url = `${process.env.SIXPACK_URL}/usegym?date=${date}&id=${user.sub}`;
    const qr = qrcode.toDataURL(url);
    return qr;
  }

  /**
   * @description 유저의 가맹점 이용기록 저장
   * @author 김승일
   * @argument businessUser QR코드를 스캔한 사업자의 id
   * @argument date QR코드 생성 시간
   * @argument userId 유저의 id
   */
  async useGym(gymId: number, date: number, userId: number) {
    const now = Date.now();
    if (now - date > 1000 * 60 * 5) {
      throw new UnauthorizedException('QR코드가 만료되었습니다.');
    }
    await this.userGymRepo.save({
      gymId: gymId,
      userId: userId,
    });

    // businessUser 포함한 캐시 삭제
    const BusinessUserCaches = await this.cacheManager.store.keys(`businessUser*`);
    if (BusinessUserCaches.length > 0) await this.cacheManager.store.del(BusinessUserCaches);
  }

  /**
   * @description 월 별 전체 유저 이용기록 가져오기
   * @author 정호준
   * @argument date 날짜
   */
  async findUseRecord(userId) {
    const startDate = startOfMonth(new Date());
    const endDate = endOfDay(new Date());

    const useRecord = await this.userGymRepo
      .createQueryBuilder('userGym')
      .leftJoinAndSelect('userGym.gym', 'gym')
      .leftJoinAndSelect('userGym.user', 'user')
      .where('userGym.userId = :userId', { userId })
      .andWhere('userGym.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      // .select(['userGym', 'gym.gymType', 'user.membership'])
      .getMany();

    return useRecord;
  }
}
