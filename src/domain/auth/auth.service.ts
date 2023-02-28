import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/global/entities/Users';
import { Repository } from 'typeorm';
import { PostUserDto } from './dto/postUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Users) private userRepo: Repository<Users>) {}

  /**
   * 일반유저 회원가입
   * @author 김승일
   * @param dto
   */
  async postUsers(postuserDto: PostUserDto) {
    const existUser = await this.userRepo.findOne({
      where: { email: postuserDto.email },
    });
    if (existUser) throw new ConflictException('이미 존재하는 이메일입니다.');
    if (postuserDto.password !== postuserDto.passwordCheck) throw new ConflictException('비밀번호가 일치하지 않습니다.');
    const hashedPassword = await bcrypt.hash(postuserDto.password, 10);
    return await this.userRepo.save({
      email: postuserDto.email,
      password: hashedPassword,
      nickname: postuserDto.nickname,
      phone: postuserDto.phone,
    });
  }
}
