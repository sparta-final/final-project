import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gym } from 'src/global/entities/Gym';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/types/jwtPayload.type';
import { PostGymDto } from './dto/postGym.dto';

@Injectable()
export class GymService {
  constructor(
    @InjectRepository(Gym)
    private gymsrepository: Repository<Gym>
  ) {}

  /**
   * 체육관 생성
   * @author 정호준
   * @param PostGymDto
   */
  async postGyms(postgymDto: PostGymDto, user: JwtPayload) {
    const existGym = await this.gymsrepository.findOne({
      where: { name: postgymDto.name, address: postgymDto.address },
    });
    if (existGym) throw new ConflictException('이미 등록된 체육관입니다.');
    return await this.gymsrepository.save({
      businessId: user.sub,
      name: postgymDto.name,
      phone: postgymDto.phone,
      address: postgymDto.address,
      description: postgymDto.description,
      certification: postgymDto.certification,
    });
  }
  /**
   * 로그인 사업자 체육관 조회
   * @author 정호준
   */
  async getGyms(user: JwtPayload) {
    return await this.gymsrepository.find({
      where: { businessId: user.sub, deletedAt: null },
      select: ['name', 'address'],
    });
  }

  /**
   * 특정 체육관 조회
   * @author 정호준
   */
  async getGymsById(gymId: number) {
    return await this.gymsrepository.findOne({
      where: { id: gymId, deletedAt: null },
    });
  }

  /**
   * 체육관 정보 수정
   * @author 정호준
   * @param UpdateGymDto
   */
  async updateGym(gymId, name, phone, address, description, certification, user: JwtPayload) {
    await this.checkUser(gymId, user);
    const updategym = await this.gymsrepository.update(gymId, { name, phone, address, description, certification });
    return updategym;
  }

  /**
   * 체육관 정보 삭제
   * @author 정호준
   * @param UpdateGymDto
   */
  async deleteGym(gymId, user) {
    await this.checkUser(gymId, user);
    const deletegym = await this.gymsrepository.softDelete(gymId);
    return deletegym;
  }

  /**
   * 유저 확인
   * @author 정호준
   */
  private async checkUser(gymId, user) {
    const gym = this.getGymsById(gymId);
    if (user.sub !== (await gym).businessId) throw new UnauthorizedException('글쓴이가 아닙니다.');
  }
}
