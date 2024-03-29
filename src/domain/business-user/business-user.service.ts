import { Cache } from 'cache-manager';
import { ConflictException, Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Busienssusers } from 'src/global/entities/Busienssusers';
import { Repository } from 'typeorm';
import { UpdateBusinessUserInfoDto } from './dto/updateBusinessUserInfo.dto';
import * as bcrypt from 'bcrypt';
import { UserGym } from 'src/global/entities/UserGym';
import { JwtPayload } from '../auth/types/jwtPayload.type';

@Injectable()
export class BusinessUserService {
  constructor(
    @InjectRepository(Busienssusers) private readonly busniessUserRepo: Repository<Busienssusers>,
    @InjectRepository(UserGym) private readonly userGymRepo: Repository<UserGym>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  /**
   * 사업자회원 회원정보 불러오기
   * @author 주현진
   */

  async getBusinessUserInfo(user: JwtPayload) {
    const cachedBusinessUser = await this.cacheManager.get(`businessUser:ID: ${user.sub}`);
    if (cachedBusinessUser) return cachedBusinessUser;

    const businessUser = await this.busniessUserRepo.findOne({
      where: { id: user.sub, deletedAt: null },
    });
    const { password, ...rest } = businessUser;
    await this.cacheManager.set(`businessUser:ID: ${user.sub}`, rest, { ttl: 30 });

    return rest;
  }

  /**
   * 사업자회원 회원정보 수정하기
   * @author 주현진
   * @param UpdateBusinessUserInfoDto
   */

  async updateBusinessUserInfo(user: JwtPayload, updateBusinessUserInfo: UpdateBusinessUserInfoDto, file) {
    const hashedPassword = await bcrypt.hash(updateBusinessUserInfo.password, 10);
    const businessUser = await this.busniessUserRepo.findOne({
      where: { id: user.sub },
    });

    const isMatch = await bcrypt.compare(updateBusinessUserInfo.currentPassword, businessUser.password);

    if (!isMatch) throw new ConflictException('현재 비밀번호가 일치하지 않습니다.');

    if (updateBusinessUserInfo.password !== updateBusinessUserInfo.passwordCheck)
      throw new ConflictException('비밀번호가 일치하지 않습니다.');
    if (businessUser) {
      businessUser.name = updateBusinessUserInfo.name;
      businessUser.phone = updateBusinessUserInfo.phone;
      businessUser.password = hashedPassword;
      file ? (businessUser.profileImage = file.transforms[0].location) : (businessUser.profileImage = businessUser.profileImage);
      await this.busniessUserRepo.save(businessUser);

      // businessUser 포함한 캐시 삭제
      const BusinessUserCaches = await this.cacheManager.store.keys(`businessUser:ID: ${user.sub}`);
      if (BusinessUserCaches.length > 0) await this.cacheManager.store.del(BusinessUserCaches);

      return businessUser;
    }
  }

  /**
   * 사업자회원 탈퇴하기
   * @author 주현진
   */

  async deleteBusinessUser(user: JwtPayload) {
    const businessUser = await this.busniessUserRepo.findOne({
      where: { id: user.sub },
    });
    if (businessUser) {
      await this.busniessUserRepo.softDelete(businessUser.id);

      // businessUser 포함한 캐시 삭제
      const BusinessUserCaches = await this.cacheManager.store.keys(`businessUser:ID: ${user.sub}`);
      if (BusinessUserCaches.length > 0) await this.cacheManager.store.del(BusinessUserCaches);
      return businessUser;
    }
  }

  /**
   * 가맹점별 사용자 데이터 불러오기
   * @author 주현진
   */

  async getUserByGymId(gymId: number) {
    const cachedUsersOfGym = await this.cacheManager.get(`businessUser:usersOfGym:ID: ${gymId}`);
    if (cachedUsersOfGym) return cachedUsersOfGym;

    const usersOfGym = await this.userGymRepo
      .createQueryBuilder('userGym')
      .leftJoinAndSelect('userGym.user', 'user')
      .where('userGym.gymId = :gymId', { gymId })
      .getMany();

    await this.cacheManager.set(`businessUser:usersOfGym:ID: ${gymId}`, usersOfGym, { ttl: 30 });

    return usersOfGym;
  }
}
