import { userMembership } from './../../global/entities/common/user.membership';
import { Gym } from './../../global/entities/Gym';
import { Users } from './../../global/entities/Users';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    const gym = await this.gymRepo.find({
      where: { isApprove: 1, deletedAt: null },
      // DB에 Gym type 추가해서 타입별로 가져와야함
      select: [],
    });
    return gym;
  }
}
