import { JwtPayload } from 'src/domain/auth/types/jwtPayload.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UserGym } from 'src/global/entities/UserGym';
import { Repository } from 'typeorm';
import { Gym } from 'src/global/entities/Gym';
import * as qrcode from 'qrcode';

@Injectable()
export class QrcodeService {
  constructor(
    @InjectRepository(UserGym) private userGymRepo: Repository<UserGym>,
    @InjectRepository(Gym) private gymRepo: Repository<Gym>
  ) {}
  async createQRcode(user: JwtPayload) {
    const url = `https://1a1d-222-105-132-20.jp.ngrok.io/usegym?id=${user.sub}`;
    const qr = await qrcode.toDataURL(url);
    return qr;
  }

  async useGym(businessUser: JwtPayload, userId: number) {
    const gym = await this.gymRepo.findOne({ where: { businessId: businessUser.sub } });
    await this.userGymRepo.save({
      gymId: gym.id,
      userId: userId,
    });
  }
}
