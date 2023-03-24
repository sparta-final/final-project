import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gym } from 'src/global/entities/Gym';
import { GymImg } from 'src/global/entities/GymImg';
import { GymController } from './gym.controller';
import { GymService } from './gym.service';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/global/common/utils/multer.options.factory';
import { Busienssusers } from 'src/global/entities/Busienssusers';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gym, GymImg, Busienssusers]),
    JwtModule.register({}),
    MulterModule.registerAsync({
      useFactory: multerOptionsFactory,
    }),
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
      // node: 'http://elasticsearch:9200',
    }),
  ],
  controllers: [GymController],
  providers: [GymService],
})
export class GymModule {}
