import { userMembership } from './../../global/entities/common/user.membership';
import { Gym } from './../../global/entities/Gym';
import { Users } from './../../global/entities/Users';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GymType } from 'src/global/entities/common/enums';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    @InjectRepository(Gym) private gymRepo: Repository<Gym>
  ) {}

  /**
   * @description 멤버십 별 구독 회원 수 조회
   * @author 한정훈
   */
  async getMember() {
    const basic = await this.userRepo.count({
      where: { membership: userMembership.Basic, deletedAt: null },
    });
    const standard = await this.userRepo.count({
      where: { membership: userMembership.Standard, deletedAt: null },
    });
    const premium = await this.userRepo.count({
      where: { membership: userMembership.Premium, deletedAt: null },
    });
    return [basic, standard, premium];
  }

  /**
   * @description 승인된 제휴 업체 수 조회
   * @author 한정훈
   */
  async getGym() {
    const fitness = await this.gymRepo.count({
      where: { gymType: GymType.fitness, isApprove: 1, deletedAt: null },
    });
    const pilates = await this.gymRepo.count({
      where: { gymType: GymType.pilates, isApprove: 1, deletedAt: null },
    });
    const crossfit = await this.gymRepo.count({
      where: { gymType: GymType.crossfit, isApprove: 1, deletedAt: null },
    });
    return [fitness, pilates, crossfit];
  }
}
