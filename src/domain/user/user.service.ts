import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/global/entities/Users';
import { Repository } from 'typeorm';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(Users) private userRepo: Repository<Users>) {}

  /**
   * 일반유저 회원정보 불러오기
   * @author 주현진
   */

  async getUserInfo(id: number) {
    const user = await this.userRepo.findOne({
      where: { id, deletedAt: null },
    });
    console.log('user :', user);
    return user;
  }

  /**
   * 일반유저 회원정보 수정하기
   * @author 주현진
   * @param UpdateUserInfoDto
   */

  async updateUserInfo(id: number, updateUserInfo: UpdateUserInfoDto, file: Express.MulterS3.File) {
    const hashedPassword = await bcrypt.hash(updateUserInfo.password, 10);
    const user = await this.userRepo.findOne({
      where: { id },
    });

    const isMatch = await bcrypt.compare(updateUserInfo.currentPassword, user.password);

    if (!isMatch) throw new ConflictException('현재 비밀번호가 일치하지 않습니다.');

    console.log('user', user);

    console.log('file.location', file);

    if (updateUserInfo.password !== updateUserInfo.passwordCheck) throw new ConflictException('비밀번호가 일치하지 않습니다.');
    if (user) {
      user.nickname = updateUserInfo.nickname;
      user.phone = updateUserInfo.phone;
      user.password = hashedPassword;
      file ? (user.profileImage = file.location) : (user.profileImage = null);
      await this.userRepo.save(user);
      return user;
    }
  }

  /**
   * 일반유저 탈퇴하기
   * @author 주현진
   */

  async deleteUser(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    });
    if (user) {
      user.deletedAt = new Date();
      await this.userRepo.save(user);
      return user;
    }
  }
}
