import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gym } from 'src/global/entities/Gym';
import { GymImg } from 'src/global/entities/GymImg';
import { GymController } from './gym.controller';
import { GymService } from './gym.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Gym, GymImg]), JwtModule.register({})],
  controllers: [GymController],
  providers: [GymService],
})
export class GymModule {}
