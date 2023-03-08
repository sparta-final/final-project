import { Reviews } from './../../global/entities/Reviews';
import { Calculate } from './../../global/entities/Calculate';
import { Payments } from './../../global/entities/Payments';
import { userMembership } from './../../global/entities/common/user.membership';
import { Gym } from './../../global/entities/Gym';
import { Users } from './../../global/entities/Users';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { GymType } from 'src/global/entities/common/enums';
import { UserGym } from 'src/global/entities/UserGym';
import * as _ from 'lodash';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    @InjectRepository(Gym) private gymRepo: Repository<Gym>,
    @InjectRepository(Payments) private paymentRepo: Repository<Payments>,
    @InjectRepository(UserGym) private userGymRepo: Repository<UserGym>,
    @InjectRepository(Calculate) private calculateRepo: Repository<Calculate>,
    @InjectRepository(Reviews) private reviewRepo: Repository<Reviews>
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
   * @description 업체 순위에 들어갈 테이터
   * @author 한정훈
   * @argument category (미구현)
   * @argument year
   * @argument month
   */
  async getRank(date) {
    let rank = [];
    const getAllGym = await this.calculateRepo.find({
      where: {
        createdAt: Between(new Date(date.year, date.month - 1), new Date(date.year, date.month)),
      },
      select: ['gymId', 'paid'],
    });

    for (let i = 0; i < getAllGym.length; i++) {
      // Promise.all 방식 (평균 30ms)
      // const rankData = await Promise.all([
      //   {
      //     paid: await this.calculateRepo.find({
      //       where: { gymId: getAllGym[i].id },
      //       select: ['paid'],
      //     }),
      //     useCount: await this.userGymRepo.count({
      //       where: { gymId: getAllGym[i].id },
      //       select: ['gymId'],
      //     }),
      //     rating: await this.reviewRepo.find({
      //       where: { userGym: { id: getAllGym[i].id } },
      //       select: ['star'],
      //     }),
      //   },
      // ]);

      // 평균 20ms
      // const getPaid = await this.calculateRepo.find({
      //   where: { gymId: getAllGym[i].gymId },
      //   select: ['paid'],
      // });

      const getUseCount = await this.userGymRepo.count({
        where: { gymId: getAllGym[i].gymId },
        select: ['gymId'],
      });

      const getRating = await this.reviewRepo.find({
        where: { userGym: { id: getAllGym[i].gymId } },
        select: ['star'],
      });

      rank.push({
        gymId: getAllGym[i].gymId,
        paid: getAllGym[i].paid,
        count: getUseCount,
        rating: getRating[0]?.star ? getRating[0].star : 0,
        // Promise.all 방식
        // rank.push({
        //   gymId: getAllGym[i].id,
        //   paid: rankData[0]?.paid[0]?.paid ? rankData[0].paid[0].paid : 0,
        //   count: rankData[0].useCount,
        //   rating: rankData[0]?.rating[0]?.star ? rankData[0].rating[0].star : 0,
        // });
      });
    }
    return rank;
  }

  // ******************** 정산하기 ********************

  /**
   * @description 정산하기
   * @author 한정훈
   * @argument gymId
   * @argument year
   * @argument month
   */
  async calculatePaid(id, date) {
    const getVisitUser = await this.getVisitUser(id, date);
    // 방문 리스트 중 중복된 userId 제거 (lodash 함수 이용)
    const visitUser = _.uniqBy(getVisitUser, 'userId');

    let totalPaid = 0;
    const visitInfos = await this.getVisitInfos(id, visitUser, date);

    visitInfos.forEach((a) => {
      let paid = 0;
      if (a.membership[0].membership === 'Basic') {
        paid = 80000 / a.visitGym;
      }
      if (a.membership[0].membership === 'Standard') {
        paid = 160000 / a.visitGym;
      }
      if (a.membership[0].membership === 'Premium') {
        paid = 240000 / a.visitGym;
      }
      let userPaid = Math.ceil((a.visitUserCount * paid) / 10) * 10;
      totalPaid += userPaid;
    });

    const calculateSave = this.calculateRepo.save({
      gymId: id,
      paid: totalPaid,
    });
  }
  getVisitInfos = async (id, visitUser, date) => {
    return await Promise.all(
      visitUser.map(async (user) => ({
        user: user,
        // 방문유저 이번달 전체 헬스장 이용 횟수 조회
        visitGym: await this.getVisitGym(user.userId, date),
        // 방문유저 멤버십 조회
        membership: await this.getMembership(user.userId),
        // 조회한 유저 조회한 헬스장 방문 횟수
        visitUserCount: await this.getVisitUserCount(id, user.userId, date),
      }))
    );
  };

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
   * @param month
   */
  async getSalesMonth(date) {
    const salesMonth = await this.paymentRepo.sum('amount', {
      createdAt: Between(new Date(date.year, date.month - 1), new Date(date.year, date.month)),
      deletedAt: null,
    });
    return salesMonth;
  }

  /**
   * @description 헬스장 월 별 방문자 조회
   * @author 한정훈
   * @param gymId
   * @param year
   * @param month
   */
  async getVisitUser(id, date) {
    const getVisitUser = await this.userGymRepo.find({
      where: {
        gymId: id,
        createdAt: Between(new Date(Number(date.year), Number(date.month) - 1), new Date(Number(date.year), Number(date.month))),
      },
    });
    return getVisitUser;
  }

  /**
   * @description 유저 월 별 방문 헬스장 조회
   * @author 한정훈
   * @param userId
   * @param year
   * @param month
   */
  async getVisitGym(id, date) {
    const getVisitGym = await this.userGymRepo.count({
      where: {
        userId: id,
        createdAt: Between(new Date(Number(date.year), Number(date.month) - 1), new Date(Number(date.year), Number(date.month))),
      },
    });
    return getVisitGym;
  }

  /**
   * @description 유저 멤버십 조회
   * @author 한정훈
   * @param id
   */
  async getMembership(id) {
    const getMembership = await this.userRepo.find({
      where: { id },
      select: ['membership'],
    });
    return getMembership;
  }

  /**
   * @description 헬스장 유저별 방문횟수 조회
   * @author 한정훈
   * @param gymId
   * @param userId
   * @param year
   * @param month
   */
  async getVisitUserCount(gymId, userId, date) {
    const getVisitUserCount = await this.userGymRepo.count({
      where: {
        gymId: gymId,
        userId: userId,
        createdAt: Between(new Date(Number(date.year), Number(date.month) - 1), new Date(Number(date.year), Number(date.month))),
      },
    });
    return getVisitUserCount;
  }
}
