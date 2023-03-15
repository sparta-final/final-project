import { ApproveDto } from './dto/approveGym.dto';
import { Cache } from 'cache-manager';
import { Reviews } from './../../global/entities/Reviews';
import { Calculate } from './../../global/entities/Calculate';
import { Payments } from './../../global/entities/Payments';
import { userMembership } from './../../global/entities/common/user.membership';
import { Gym } from './../../global/entities/Gym';
import { Users } from './../../global/entities/Users';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { GymType } from 'src/global/entities/common/enums';
import { UserGym } from 'src/global/entities/UserGym';
import * as _ from 'lodash';
import { isApprove } from 'src/global/entities/common/gym.isApprove';
import { arrayBuffer } from 'stream/consumers';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    @InjectRepository(Gym) private gymRepo: Repository<Gym>,
    @InjectRepository(Payments) private paymentRepo: Repository<Payments>,
    @InjectRepository(UserGym) private userGymRepo: Repository<UserGym>,
    @InjectRepository(Calculate) private calculateRepo: Repository<Calculate>,
    @InjectRepository(Reviews) private reviewRepo: Repository<Reviews>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  /**
   * @description 멤버십 별 구독 회원 수 조회
   * @author 한정훈
   */
  async getMember() {
    const cachedBasic = await this.cacheManager.get('admin:basic-member');
    const cachedStandard = await this.cacheManager.get('admin:standard-member');
    const cachedPremium = await this.cacheManager.get('admin:premium-member');
    if (cachedBasic || cachedStandard || cachedPremium) {
      return [cachedBasic, cachedStandard, cachedPremium];
    }

    const basic = await this.userRepo.count({
      where: { membership: userMembership.Basic, deletedAt: null },
    });
    await this.cacheManager.set('admin:basic-member', basic, { ttl: 60 });

    const standard = await this.userRepo.count({
      where: { membership: userMembership.Standard, deletedAt: null },
    });
    await this.cacheManager.set('admin:standard-member', standard, { ttl: 60 });

    const premium = await this.userRepo.count({
      where: { membership: userMembership.Premium, deletedAt: null },
    });
    await this.cacheManager.set('admin:premium-member', premium, { ttl: 60 });

    return [basic, standard, premium];
  }

  /**
   * @description 승인된 제휴 가맹점 수 조회
   * @author 한정훈
   */
  async getGym() {
    const cachedFitness = await this.cacheManager.get('admin:fitness-gym');
    const cachedPilates = await this.cacheManager.get('admin:pilates-gym');
    const cachedCrossfit = await this.cacheManager.get('admin:crossfit-gym');
    if (cachedFitness || cachedPilates || cachedCrossfit) {
      return [cachedFitness, cachedPilates, cachedCrossfit];
    }

    const fitness = await this.gymRepo.count({
      where: { gymType: GymType.fitness, isApprove: 1, deletedAt: null },
    });
    await this.cacheManager.set('admin:fitness-gym', fitness, { ttl: 60 });

    const pilates = await this.gymRepo.count({
      where: { gymType: GymType.pilates, isApprove: 1, deletedAt: null },
    });
    await this.cacheManager.set('admin:pilates-gym', pilates, { ttl: 60 });

    const crossfit = await this.gymRepo.count({
      where: { gymType: GymType.crossfit, isApprove: 1, deletedAt: null },
    });
    await this.cacheManager.set('admin:crossfit-gym', crossfit, { ttl: 60 });

    return [fitness, pilates, crossfit];
  }

  /**
   * @description 승인대기중인 가맹점 리스트 조회
   * @author 한정훈
   */
  async beforeApproveGym() {
    const cachedBeforeApprove = await this.cacheManager.get('admin:before-approve');
    if (cachedBeforeApprove) return cachedBeforeApprove;

    const beforeApprove = await this.gymRepo.find({
      where: { isApprove: 2, deletedAt: null },
      relations: ['gymImgs'],
    });
    await this.cacheManager.set('admin:before-approve', beforeApprove, { ttl: 60 });

    return beforeApprove;
  }

  /**
   * @description 승인대기중인 가맹점 상세 조회
   * @author 한정훈
   * @argument id
   */
  async beforeApproveGymId(id) {
    const cachedBeforeApproveById = await this.cacheManager.get(`admin:before-approve-${id}`);
    if (cachedBeforeApproveById) return cachedBeforeApproveById;

    const beforeApprove = await this.gymRepo.find({
      where: { id, deletedAt: null },
      relations: ['gymImgs'],
    });
    await this.cacheManager.set(`admin:before-approve-${id}`, beforeApprove, { ttl: 60 });

    return beforeApprove;
  }

  /**
   * @description 가맹점 순위에 들어갈 테이터
   * @author 한정훈
   * @argument category (미구현)
   * @argument year
   * @argument month
   */
  async getRank(date) {
    const cachedRank = await this.cacheManager.get(`admin:rank-${date.year}-${date.month}`);
    if (cachedRank) return cachedRank;

    let rank = [];
    const getAllGym = await this.gymRepo.find({
      where: {
        isApprove: 1,
        // createdAt: Between(new Date(date.year, date.month - 1), new Date(date.year, date.month)),
        deletedAt: null,
      },
      select: ['id', 'name'],
    });

    // const getAllGym = await this.calculateRepo.find({
    //   where: {
    //     createdAt: Between(new Date(date.year, date.month - 1), new Date(date.year, date.month)),
    //   },
    //   select: ['gymId', 'paid'],
    // });

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
      const getPaid = await this.calculateRepo.find({
        where: {
          gymId: getAllGym[i].id,
          createdAt: Between(new Date(date.year, date.month - 1), new Date(date.year, date.month)),
        },
        select: ['paid'],
      });

      const getUseCount = await this.userGymRepo.count({
        where: {
          gymId: getAllGym[i].id,
          createdAt: Between(new Date(date.year, date.month - 1), new Date(date.year, date.month)),
        },
        select: ['gymId'],
      });

      const getRating = await this.reviewRepo.find({
        where: {
          userGym: { id: getAllGym[i].id },
          createdAt: Between(new Date(date.year, date.month - 1), new Date(date.year, date.month)),
        },
        select: ['star'],
      });
      console.log('✨✨✨', '5', getRating, '✨✨✨'); // => 빈배열나옴

      rank.push({
        name: getAllGym[i].name,
        paid: getPaid[0]?.paid ? getPaid[0].paid : 0,
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
    await this.cacheManager.set(`admin:rank-${date.year}-${date.month}`, rank, { ttl: 60 });

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
   * @description 승인 요청된 제휴가맹점 승인하기
   * @author 한정훈
   * @argument id
   */
  async approveGym(gymId: number) {
    const updateGym = await this.gymRepo.update(gymId, {
      isApprove: 1,
    });
    await this.cacheManager.del('admin:before-approve');
    await this.cacheManager.del(`admin:before-approve-${gymId}`);
    await this.cacheManager.del('gym:allGym');

    return updateGym;
  }

  /**
   * @description 식스팩 누적 매출
   * @author 한정훈
   */
  async getSalesAll() {
    const cachedSalesAll = await this.cacheManager.get('admin:salesAll');
    if (cachedSalesAll) return cachedSalesAll;

    const salesAll = await this.paymentRepo.sum('amount', { deletedAt: null });
    await this.cacheManager.set('admin:salesAll', salesAll, { ttl: 60 });

    return salesAll;
  }

  /**
   * @description 식스팩 월 별 매출
   * @author 한정훈
   * @param year
   * @param month
   */
  async getSalesMonth(date) {
    const cachedSalesMonth = await this.cacheManager.get(`admin:salesMonth-${date.year}-${date.month}`);
    if (cachedSalesMonth) return cachedSalesMonth;

    const salesMonth = await this.paymentRepo.sum('amount', {
      createdAt: Between(new Date(date.year, date.month - 1), new Date(date.year, date.month)),
      deletedAt: null,
    });
    if (!salesMonth) return 0;
    await this.cacheManager.set(`admin:salesMonth-${date.year}-${date.month}`, salesMonth, { ttl: 60 });

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
    const cachedVisitUser = await this.cacheManager.get(`admin:visitUser-${id}-${date.year}-${date.month}`);
    if (cachedVisitUser) return cachedVisitUser;

    const getVisitUser = await this.userGymRepo.find({
      where: {
        gymId: id,
        createdAt: Between(new Date(Number(date.year), Number(date.month) - 1), new Date(Number(date.year), Number(date.month))),
      },
      relations: ['user'],
    });
    await this.cacheManager.set(`admin:visitUser-${id}-${date.year}-${date.month}`, getVisitUser, { ttl: 60 });

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
    const cachedVisitGym = await this.cacheManager.get(`admin:visitGym-${id}-${date.year}-${date.month}`);
    if (cachedVisitGym) return cachedVisitGym;

    const getVisitGym = await this.userGymRepo.count({
      where: {
        userId: id,
        createdAt: Between(new Date(Number(date.year), Number(date.month) - 1), new Date(Number(date.year), Number(date.month))),
      },
    });
    await this.cacheManager.set(`admin:visitGym-${id}-${date.year}-${date.month}`, getVisitGym, { ttl: 60 });

    return getVisitGym;
  }

  /**
   * @description 유저 멤버십 조회
   * @author 한정훈
   * @param id
   */
  async getMembership(id) {
    const cachedMembership = await this.cacheManager.get(`admin:membership-${id}`);
    if (cachedMembership) return cachedMembership;

    const getMembership = await this.userRepo.find({
      where: { id },
      select: ['membership'],
    });
    await this.cacheManager.set(`admin:membership-${id}`, getMembership, { ttl: 60 });

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
    const cachedVisitUserCount = await this.cacheManager.get(
      `admin:visitUserCount-${gymId}-${userId}-${date.year}-${date.month}`
    );
    if (cachedVisitUserCount) return cachedVisitUserCount;

    const getVisitUserCount = await this.userGymRepo.count({
      where: {
        gymId: gymId,
        userId: userId,
        createdAt: Between(new Date(Number(date.year), Number(date.month) - 1), new Date(Number(date.year), Number(date.month))),
      },
    });
    await this.cacheManager.set(`admin:visitUserCount-${gymId}-${userId}-${date.year}-${date.month}`, getVisitUserCount, {
      ttl: 60,
    });

    return getVisitUserCount;
  }

  /**
   * @description 헬스장 월별 매출 가져오기
   * @author 정호준
   * @param gymId
   * @param year
   * @param month
   */
  async getPaidGym(gymId, date) {
    const cachedMonthlySales = await this.cacheManager.get(`admin:monthlySales-${gymId}-${date.year}-${date.month}`);
    if (cachedMonthlySales) return cachedMonthlySales;

    const monthlySales = await this.calculateRepo.find({
      where: {
        gymId: gymId,
        createdAt: Between(new Date(date.year, date.month - 1), new Date(date.year, date.month)),
      },
    });
    await this.cacheManager.set(`admin:monthlySales-${gymId}-${date.year}-${date.month}`, monthlySales, { ttl: 60 });

    return monthlySales;
  }
}
