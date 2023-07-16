import { KakaoLoginUserDto } from './dto/kakaologinUser.dto';
import { PostBusinessUserDto } from './dto/postBusinessUser.dto';
import {
  BadRequestException,
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/global/entities/Users';
import { Repository } from 'typeorm';
import { PostUserDto } from './dto/postUser.dto';
import * as bcrypt from 'bcrypt';
import { Busienssusers } from 'src/global/entities/Busienssusers';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtPayload } from './types/jwtPayload.type';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { Adminusers } from 'src/global/entities/adminusers';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    @InjectRepository(Adminusers) private adminUserRepo: Repository<Adminusers>,
    @InjectRepository(Busienssusers) private businessUserRepo: Repository<Busienssusers>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService
  ) {}

  /**
   * @description 일반유저 회원가입
   * @author 김승일
   * @argument postuserDto
   */
  async postUsers(postuserDto: PostUserDto) {
    const existUser = await this.userRepo.findOne({
      where: { email: postuserDto.email },
    });
    if (existUser) throw new ConflictException('이미 존재하는 이메일입니다.');
    if (postuserDto.password !== postuserDto.passwordCheck) throw new ConflictException('비밀번호가 일치하지 않습니다.');
    const hashedPassword = await bcrypt.hash(postuserDto.password, 10);
    const postUser = await this.userRepo.save({
      email: postuserDto.email,
      password: hashedPassword,
      nickname: postuserDto.nickname,
      phone: postuserDto.phone,
    });
    const tokens = await this.getTokens(postUser.id, postUser.email, 'user');
    return tokens;
  }

  /**
   * @description 사업자 회원가입
   * @author 김승일
   * @argument postBusinessUserDto
   */
  async postBusinessUsers(postBusinessUserDto: PostBusinessUserDto) {
    const existUser = await this.businessUserRepo.findOne({
      where: { email: postBusinessUserDto.email },
    });
    if (existUser) throw new ConflictException('이미 존재하는 이메일입니다.');
    if (postBusinessUserDto.password !== postBusinessUserDto.passwordCheck)
      throw new ConflictException('비밀번호가 일치하지 않습니다.');
    const hashedPassword = await bcrypt.hash(postBusinessUserDto.password, 10);
    const postUser = await this.businessUserRepo.save({
      email: postBusinessUserDto.email,
      password: hashedPassword,
      name: postBusinessUserDto.name,
      phone: postBusinessUserDto.phone,
    });
    const tokens = await this.getTokens(postUser.id, postUser.email, 'business');
    return tokens;
  }

  /**
   * @description 일반유저 로그인
   * @author 김승일
   * @argument loginUserDto
   */
  async userlogin(loginUserDto: LoginUserDto) {
    if (!loginUserDto.email || !loginUserDto.password) throw new BadRequestException('이메일과 비밀번호를 입력해주세요.');
    const existUser = await this.userRepo.findOne({ where: { email: loginUserDto.email } });
    if (!existUser) throw new NotFoundException('이메일 또는 비밀번호를 잘못 입력했습니다.');
    const isMatch = await bcrypt.compare(loginUserDto.password, existUser.password);
    if (!isMatch) throw new BadRequestException('이메일 또는 비밀번호를 잘못 입력했습니다.');
    const tokens = await this.getTokens(existUser.id, existUser.email, 'user');
    return tokens;
  }

  /**
   * @description 사업자 로그인
   * @author 김승일
   * @argument loginUserDto
   */
  async businessUserlogin(loginUserDto: LoginUserDto) {
    const existUser = await this.businessUserRepo.findOne({ where: { email: loginUserDto.email } });
    if (!existUser) throw new NotFoundException('이메일 또는 비밀번호를 잘못 입력했습니다.');
    const isMatch = await bcrypt.compare(loginUserDto.password, existUser.password);
    if (!isMatch) throw new BadRequestException('이메일 또는 비밀번호를 잘못 입력했습니다.');
    const tokens = await this.getTokens(existUser.id, existUser.email, 'business');
    return tokens;
  }

  /**
   * @description 카카오 로그인
   * @author 김승일
   * @argument user @argument res
   */
  async KakaoLogin(user: KakaoLoginUserDto, _res: Response) {
    // 1. 가입 확인
    const existUser = await this.userRepo.findOne({ where: { email: user.email } });
    // 패스워드 암호화
    const hashedPassword = await bcrypt.hash('1234', 10);
    // 2. 회원가입
    if (!existUser) {
      const newUser = await this.userRepo.save({
        nickname: user.nickname,
        email: user.email,
        // TODO : 카카오 로그인은 비밀번호, 전화번호 못받아옴. 나중에 수정 후 확인 필요
        password: hashedPassword,
        phone: '01012341234',
      });
      // 3. 로그인 완료 후 토큰 발급
      const tokens = await this.getTokens(newUser.id, newUser.email, 'user');
      return tokens;
    }
    const tokens = await this.getTokens(existUser.id, existUser.email, 'user');
    return tokens;
  }

  /**
   * @description 어드민 로그인
   * @author 김승일
   */
  async adminLogin(admin: LoginUserDto) {
    const existAdmin = await this.adminUserRepo.findOne({ where: { email: admin.email } });
    if (!existAdmin) throw new NotFoundException('잘못된 접근입니다.');
    if (admin.email !== process.env.ADMIN_EMAIL) throw new UnauthorizedException('이메일을 잘못 입력했습니다.');
    if (admin.password !== process.env.ADMIN_PASSWORD) throw new UnauthorizedException('비밀번호를 잘못 입력했습니다.');
    const tokens = await this.getTokens(existAdmin.id, existAdmin.email, 'admin');
    return tokens;
  }

  /**
   * @description access token, refresh token 발급
   * @author 김승일
   * @argument userId @argument email
   */
  async getTokens(userId: number, email: string, type: string) {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
      type,
    };

    const [AccessToken, RefreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);
    // RefreshToken 암호화 후 캐시에 저장
    const hashRefreshToken = bcrypt.hashSync(RefreshToken, 10);
    await this.cacheManager.set(`refresh:${type}/${email}`, hashRefreshToken, {
      ttl: 60 * 60 * 24 * 7, // 7일
    });
    return { AccessToken, RefreshToken };
  }

  /**
   * @description 토큰 재발급
   * @author 김승일
   * @argument user @argument rt
   */
  async restoreRefreshToken(user: JwtPayload, rt: string) {
    // user.type에 따라 적절한 repo를 선택합니다.
    let repo: Repository<Users | Busienssusers | Adminusers>;
    if (user.type === 'user') {
      repo = this.userRepo;
    } else if (user.type === 'business') {
      repo = this.businessUserRepo;
    } else if (user.type === 'admin') {
      repo = this.adminUserRepo;
    } else {
      throw new BadRequestException('잘못된 요청입니다.');
    }

    // user.id로 해당 유저가 존재하는지 확인하고 없으면 NotFoundException을 던집니다.
    const existUser = await repo.findOne({
      where: { id: user.sub },
    });
    if (!existUser) throw new NotFoundException(`${user.type}가 존재하지 않습니다.`);

    // 캐시에서 hashedRt를 가져오고 bcrypt.compare로 rt와 비교하고 일치하지 않으면 UnauthorizedException을 던집니다.
    const hashedRt: string = await this.cacheManager.get(`refresh:${user.type}/${user.email}`);
    const rtMatch = await bcrypt.compare(rt, hashedRt);
    if (!rtMatch) throw new UnauthorizedException('RefreshToken이 일치하지 않습니다.');

    // getTokens 함수를 호출하여 tokens를 반환합니다.
    const tokens = await this.getTokens(existUser.id, existUser.email, user.type);
    return tokens;
  }

  /**
   * @description 로그아웃(레디스에 저장된 토큰 삭제)
   * @author 김승일
   * @argument user @argument rt
   */
  async logout(user: JwtPayload, rt: string) {
    const hashedRt: string = await this.cacheManager.get(`refresh:${user.type}/${user.email}`);

    const rtMatch = await bcrypt.compare(rt, hashedRt);
    if (!rtMatch) throw new UnauthorizedException('RefreshToken이 일치하지 않습니다.');

    await this.cacheManager.del(`refresh:${user.type}/${user.email}`);
    return { success: true };
  }

  /**
   * @description 엑세스 토큰 만료 확인
   * @author 김승일
   * @argument token
   */
  async checkAcessTokenExpired(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        // throw new UnauthorizedException('토큰이 만료되었습니다.');
        return false;
      } else {
        throw err;
      }
    }
  }

  /**
   * @description 리프레쉬 토큰 만료 확인
   * @author 김승일
   * @argument token
   */
  async checkRefreshTokenExpired(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        // throw new UnauthorizedException('토큰이 만료되었습니다.');
        return false;
      } else {
        throw err;
      }
    }
  }
}
