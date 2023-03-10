import { ConflictException, Injectable } from '@nestjs/common';
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
    @InjectRepository(UserGym) private readonly userGymRepo: Repository<UserGym>
  ) {}

  /**
   * 사업자회원 회원정보 불러오기
   * @author 주현진
   */

  async getBusinessUserInfo(user: JwtPayload) {
    const businessUser = await this.busniessUserRepo.findOne({
      where: { id: user.sub, deletedAt: null },
    });
    const { password, ...rest } = businessUser;

    return rest;
  }

  /**
   * 사업자회원 회원정보 수정하기
   * @author 주현진
   * @param UpdateBusinessUserInfoDto
   */

  async updateBusinessUserInfo(user: JwtPayload, updateBusinessUserInfo: UpdateBusinessUserInfoDto, file: Express.MulterS3.File) {
    const hashedPassword = await bcrypt.hash(updateBusinessUserInfo.password, 10);
    const businessUser = await this.busniessUserRepo.findOne({
      where: { id: user.sub },
    });

    const isMatch = await bcrypt.compare(updateBusinessUserInfo.currentPassword, businessUser.password);

    if (!isMatch) throw new ConflictException('현재 비밀번호가 일치하지 않습니다.');

    console.log('businessUser', businessUser);

    if (updateBusinessUserInfo.password !== updateBusinessUserInfo.passwordCheck)
      throw new ConflictException('비밀번호가 일치하지 않습니다.');
    if (businessUser) {
      businessUser.name = updateBusinessUserInfo.name;
      businessUser.phone = updateBusinessUserInfo.phone;
      businessUser.password = hashedPassword;
      file ? (businessUser.profileImage = file.location) : (businessUser.profileImage = null);
      await this.busniessUserRepo.save(businessUser);
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
      businessUser.deletedAt = new Date();
      await this.busniessUserRepo.save(businessUser);
      return businessUser;
    }
  }

  /**
   * 업체별 사용자 데이터 불러오기
   * @author 주현진
   */

  async getUserByGymId(gymId: number) {
    return await this.userGymRepo
      .createQueryBuilder('userGym')
      .leftJoinAndSelect('userGym.user', 'user')
      .where('userGym.gymId = :gymId', { gymId })
      .getMany();
  }
}
