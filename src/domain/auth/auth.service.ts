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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
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
    return await this.userRepo.save({
      email: postuserDto.email,
      password: hashedPassword,
      nickname: postuserDto.nickname,
      phone: postuserDto.phone,
    });
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
    return await this.businessUserRepo.save({
      email: postBusinessUserDto.email,
      password: hashedPassword,
      name: postBusinessUserDto.name,
      phone: postBusinessUserDto.phone,
    });
  }

  /**
   * @description 일반유저 로그인
   * @author 김승일
   * @argument loginUserDto
   */
  async userlogin(loginUserDto: LoginUserDto) {
    const existUser = await this.userRepo.findOne({ where: { email: loginUserDto.email } });
    if (!existUser) throw new NotFoundException('이메일이 존재하지 않습니다.');
    const isMatch = await bcrypt.compare(loginUserDto.password, existUser.password);
    if (!isMatch) throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    const tokens = await this.getTokens(existUser.id, existUser.email);
    return tokens;
  }

  /**
   * @description 사업자 로그인
   * @author 김승일
   * @argument loginUserDto
   */
  async businessUserlogin(loginUserDto: LoginUserDto) {
    const existUser = await this.businessUserRepo.findOne({ where: { email: loginUserDto.email } });
    if (!existUser) throw new NotFoundException('이메일이 존재하지 않습니다.');
    const isMatch = await bcrypt.compare(loginUserDto.password, existUser.password);
    if (!isMatch) throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    const tokens = await this.getTokens(existUser.id, existUser.email);
    return tokens;
  }

  /**
   * @description 카카오 로그인
   * @author 김승일
   * @argument user
   * @argument res
   */
  async KakaoLogin(user: KakaoLoginUserDto, _res: Response) {
    // 1. 가입 확인
    const existUser = await this.userRepo.findOne({ where: { email: user.email } });
    // 2. 회원가입
    if (!existUser) {
      const newUser = await this.userRepo.save({
        nickname: user.nickname,
        email: user.email,
        // TODO : 카카오 로그인은 비밀번호, 전화번호 못받아옴. 나중에 수정 후 확인 필요
        // password: 'test',
        // phone: 'test',
      });
      // 3. 로그인 완료 후 토큰 발급
      const tokens = this.getTokens(newUser.id, newUser.email);
      return tokens;
    }
    const tokens = this.getTokens(existUser.id, existUser.email);
    // TODO : 나중에 수정 필요할듯?
    // res.redirect('http://127.0.0.1:5500/src/kakao.html');
    return tokens;
  }

  /**
   * @description access token, refresh token 발급
   * @author 김승일
   * @argument userId
   * @argument email
   */
  async getTokens(userId: number, email: string) {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
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
    await this.cacheManager.set(`refresh:${email}`, hashRefreshToken, {
      ttl: 60 * 60 * 24 * 7, // 7일
    });
    return { AccessToken, RefreshToken };
  }

  /**
   * @description 토큰 재발급(일반유저)
   * @author 김승일
   * @argument user
   * @argument rt
   */
  async restoreRefreshTokenForUser(user: JwtPayload, rt: string) {
    const existUser = await this.userRepo.findOne({
      where: { id: user.sub },
    });

    if (!existUser) throw new NotFoundException('유저가 존재하지 않습니다.');
    const hashedRt: string = await this.cacheManager.get(`refresh:${user.email}`);
    const refreshToken = rt.split(' ')[1]; // Bearer 토큰 형식에서 토큰만 추출

    const rtMatch = await bcrypt.compare(refreshToken, hashedRt);
    if (!rtMatch) throw new UnauthorizedException('RefreshToken이 일치하지 않습니다.');

    const tokens = await this.getTokens(existUser.id, existUser.email);
    return tokens;
  }

  /**
   * @description 토큰 재발급(사업자)
   * @author 김승일
   * @argument user
   * @argument rt
   */
  async restoreRefreshTokenForBusinessUser(user: JwtPayload, rt: string) {
    const existBusinessUser = await this.businessUserRepo.findOne({
      where: { id: user.sub },
    });
    if (!existBusinessUser) throw new NotFoundException('유저가 존재하지 않습니다.');
    const hashedRt: string = await this.cacheManager.get(`refresh:${user.email}`);
    const refreshToken = rt.split(' ')[1]; // Bearer 토큰 형식에서 토큰만 추출

    const rtMatch = await bcrypt.compare(refreshToken, hashedRt);
    if (!rtMatch) throw new UnauthorizedException('RefreshToken이 일치하지 않습니다.');

    const tokens = await this.getTokens(existBusinessUser.id, existBusinessUser.email);
    return tokens;
  }
}
