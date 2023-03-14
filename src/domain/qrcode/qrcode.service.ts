import { JwtPayload } from 'src/domain/auth/types/jwtPayload.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserGym } from 'src/global/entities/UserGym';
import { Between, Repository } from 'typeorm';
import { Gym } from 'src/global/entities/Gym';
import * as qrcode from 'qrcode';
import * as bcrypt from 'bcrypt';
import { MonthDto } from '../admin/dto/monthData.dto';

@Injectable()
export class QRcodeService {
  constructor(
    @InjectRepository(UserGym) private userGymRepo: Repository<UserGym>,
    @InjectRepository(Gym) private gymRepo: Repository<Gym>
  ) {}
  /**
   * @description 유저의 QR코드 생성
   * @author 김승일
   * @argument user
   */
  async createQRcode(user: JwtPayload) {
    const date = Date.now();
    // TODO : QR코드 찍으면 사업자가 유저정보 보고 이용기록 저장
    const url = `${process.env.NGROK_URL}/usegym?date=${date}&id=${user.sub}`;
    const qr = await qrcode.toDataURL(url);
    return qr;
  }

  /**
   * @description 유저의 가맹점 이용기록 저장
   * @author 김승일
   * @argument businessUser QR코드를 스캔한 사업자의 id
   * @argument date QR코드 생성 시간
   * @argument userId 유저의 id
   */
  async useGym(businessUser: JwtPayload, date: number, userId: number) {
    const now = Date.now();
    if (now - date > 1000 * 60 * 5) {
      throw new UnauthorizedException('QR코드가 만료되었습니다.');
    }
    const gym = await this.gymRepo.findOne({ where: { businessId: businessUser.sub } });
    await this.userGymRepo.save({
      gymId: gym.id,
      userId: userId,
    });
  }

  /**
   * @description 월 별 전체 유저 이용기록 가져오기
   * @author 정호준
   * @argument date 날짜
   */
  async findUseRecord(date, user) {
    const useRecord = await this.userGymRepo.find({
      where: {
        userId: user.sub,
        createdAt: Between(new Date(date.year, date.month - 1), new Date(date.year, date.month)),
      },
      relations: ['gym'],
    });
    return useRecord;
  }
}
