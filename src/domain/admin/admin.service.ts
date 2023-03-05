import { Gym } from './../../global/entities/Gym';
import { Users } from './../../global/entities/Users';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    @InjectRepository(Gym) private gymRepo: Repository<Gym>
  ) {}

  /**
   * @description 멤버십 별 구독 회원 수 조회
   * @author 한정훈
   */
  async getMember() {
    const member = await this.userRepo.find({
      where: { membership: null, deletedAt: null },
      select: ['membership'],
    });
    return member;
  }
}
