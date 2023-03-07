import { Payments } from './../../global/entities/Payments';
import { userMembership } from './../../global/entities/common/user.membership';
import { Gym } from './../../global/entities/Gym';
import { Users } from './../../global/entities/Users';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { GymType } from 'src/global/entities/common/enums';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    @InjectRepository(Gym) private gymRepo: Repository<Gym>,
    @InjectRepository(Payments) private paymentRepo: Repository<Payments>
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

  /**
   * @description 승인 요청된 제휴업체 승인하기
   * @author 한정훈
   * @argument id
   */
  async approveGym(id) {
    return await this.gymRepo.update(id, {
      isApprove: 1,
    });
  }

  /**
   * @description 식스팩 누적 매출
   * @author 한정훈
   */
  async getSalesAll() {
    const salesAll = await this.paymentRepo.sum('amount', { deletedAt: null });
    return salesAll;
  }

  /**
   * @description 식스팩 월 별 매출
   * @author 한정훈
   * @param year
   * @param date
   */
  async getSalesMonth(date) {
    const salesMonth = await this.paymentRepo.sum('amount', {
      createdAt: Between(new Date(date.year, date.month - 1), new Date(date.year, date.month)),
      deletedAt: null,
    });
    return salesMonth;
  }
}
