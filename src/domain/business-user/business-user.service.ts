import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Busienssusers } from 'src/global/entities/Busienssusers';
import { Repository } from 'typeorm';
import { UpdateBusinessUserInfoDto } from './dto/updateBusinessUserInfo.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BusinessUserService {
  constructor(@InjectRepository(Busienssusers) private readonly busniessUserRepo: Repository<Busienssusers>) {}

  /**
   * 사업자회원 회원정보 불러오기
   * @author 주현진
   */

  async getBusinessUserInfo(id: number) {
    const businessUser = await this.busniessUserRepo.findOne({
      where: { id, deletedAt: null },
    });
    console.log('businessUser :', businessUser);
    return businessUser;
  }

  /**
   * 사업자회원 회원정보 수정하기
   * @author 주현진
   * @param UpdateBusinessUserInfoDto
   */

  async updateBusinessUserInfo(id: number, updateBusinessUserInfo: UpdateBusinessUserInfoDto, file: Express.MulterS3.File) {
    const hashedPassword = await bcrypt.hash(updateBusinessUserInfo.password, 10);
    const businessUser = await this.busniessUserRepo.findOne({
      where: { id },
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

  async deleteBusinessUser(id: number) {
    const businessUser = await this.busniessUserRepo.findOne({
      where: { id },
    });
    if (businessUser) {
      businessUser.deletedAt = new Date();
      await this.busniessUserRepo.save(businessUser);
      return businessUser;
    }
  }
}
