import { JwtPayload } from 'src/domain/auth/types/jwtPayload.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserGym } from 'src/global/entities/UserGym';
import { Repository } from 'typeorm';
import { Gym } from 'src/global/entities/Gym';
import * as qrcode from 'qrcode';
import * as bcrypt from 'bcrypt';

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
    const url = `https://53d7-211-230-207-27.jp.ngrok.io/usegym?date=${date}&id=${user.sub}`;
    const qr = await qrcode.toDataURL(url);
    return qr;
  }

  /**
   * @description 유저의 업체 이용기록 저장
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
}
