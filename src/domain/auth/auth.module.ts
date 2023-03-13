import { JwtKakaoStrategy } from './strategy/jwt-kakao.strategy';
import { Busienssusers } from './../../global/entities/Busienssusers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/global/entities/Users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategy/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { Adminusers } from 'src/global/entities/adminusers';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Busienssusers, Adminusers]), JwtModule.register({})],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, JwtKakaoStrategy],
})
export class AuthModule {}
