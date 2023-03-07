import { Gym } from './../../global/entities/Gym';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/global/entities/Users';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Payments } from 'src/global/entities/Payments';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Gym, Payments])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
