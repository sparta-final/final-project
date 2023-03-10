import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/global/entities/Users';
import { Repository } from 'typeorm';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../auth/types/jwtPayload.type';

@Injectable()
export class UserService {
  constructor(@InjectRepository(Users) private readonly userRepo: Repository<Users>) {}

  /**
   * 일반회원 회원정보 불러오기
   * @author 주현진
   */

  async getUserInfo(user: JwtPayload) {
    const existUser = await this.userRepo.findOne({
      where: { id: user.sub, deletedAt: null },
    });
    const { password, ...rest } = existUser;

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
  }
}
