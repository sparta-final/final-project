import { Cache } from 'cache-manager';
import { CACHE_MANAGER, ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/global/entities/Users';
import { Repository } from 'typeorm';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../auth/types/jwtPayload.type';
import { UserGym } from 'src/global/entities/UserGym';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepo: Repository<Users>,
    @InjectRepository(UserGym) private readonly userGymRepo: Repository<UserGym>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  /**
   * 일반회원 회원정보 불러오기
   * @author 주현진
   */

  async getUserInfo(user: JwtPayload) {
    const cachedUser = await this.cacheManager.get(`user:ID: ${user.sub}`);
    if (cachedUser) return cachedUser;

    const existUser = await this.userRepo.findOne({
      where: { id: user.sub, deletedAt: null },
    });
    const { password, ...rest } = existUser;

    await this.cacheManager.set(`user:ID: ${user.sub}`, rest, { ttl: 60 });

    return rest;
  }

  /**
   * 일반회원 회원정보 수정하기
   * @author 주현진
   * @param UpdateUserInfoDto
   */

  async updateUserInfo(user: JwtPayload, updateUserInfo: UpdateUserInfoDto, file: Express.MulterS3.File) {
    const hashedPassword = await bcrypt.hash(
      updateUserInfo.password === '' ? updateUserInfo.currentPassword : updateUserInfo.password,
      10
    );
    const existUser = await this.userRepo.findOne({
      where: { id: user.sub },
    });

    const isMatch = await bcrypt.compare(updateUserInfo.currentPassword, existUser.password);

    if (!isMatch) throw new ConflictException('현재 비밀번호가 일치하지 않습니다.');

    if (updateUserInfo.password !== updateUserInfo.passwordCheck) throw new ConflictException('비밀번호가 일치하지 않습니다.');
    if (existUser) {
      existUser.nickname = updateUserInfo.nickname;
      existUser.phone = updateUserInfo.phone;
      existUser.password = hashedPassword;
      file ? (existUser.profileImage = file.location) : (existUser.profileImage = existUser.profileImage);
      await this.userRepo.save(existUser);
      await this.cacheManager.del(`user:ID: ${user.sub}`);
      return existUser;
    }
  }

  /**
   * 일반회원 탈퇴하기
   * @author 주현진
   */

  async deleteUser(user: JwtPayload) {
    const existUser = await this.userRepo.findOne({
      where: { id: user.sub },
    });
    if (existUser) {
      existUser.deletedAt = new Date();
      await this.userRepo.save(existUser);
      return existUser;
    }

    await this.cacheManager.del(`user:ID: ${user.sub}`);
  }

  /**
   *  @description: 일반회원 년,월별 usergym 이용내역 불러오기
   *  @author: 김승일
   */
  async getUseGymHistory(user: JwtPayload, year: number, month: number) {
    const cachedHistory = await this.cacheManager.get(`user:ID: ${user.sub}-History`);
    if (cachedHistory) return cachedHistory;

    const existUser = await this.userRepo.findOne({
      where: { id: user.sub },
    });

    // gym, review 조인 후 userGym 조회 (내림차순)
    const existUserGym = await this.userGymRepo
      .createQueryBuilder('userGym')
      .leftJoinAndSelect('userGym.gym', 'gym')
      .leftJoinAndSelect('userGym.reviews', 'reviews')
      .where('userGym.userId = :userId', { userId: existUser.id })
      .orderBy('userGym.createdAt', 'DESC')
      .getMany();

    const useGymHistory = existUserGym.filter((userGym) => {
      const userGymDate = new Date(userGym.createdAt);
      return userGymDate.getFullYear() === year && userGymDate.getMonth() + 1 === month;
    });

    await this.cacheManager.set(`user:ID: ${user.sub}-History`, useGymHistory, { ttl: 60 });

    return useGymHistory;
  }
}
