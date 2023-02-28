import { Busienssusers } from './../../global/entities/Busienssusers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/global/entities/Users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategy/jwt-access.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Busienssusers]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy],
})
export class AuthModule {}
