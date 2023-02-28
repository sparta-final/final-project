import { Busienssusers } from './../../global/entities/Busienssusers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/global/entities/Users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Busienssusers])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
