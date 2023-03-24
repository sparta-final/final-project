import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { Reviews } from './../../global/entities/Reviews';
import { Calculate } from './../../global/entities/Calculate';
import { UserGym } from 'src/global/entities/UserGym';
import { Gym } from './../../global/entities/Gym';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/global/entities/Users';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Payments } from 'src/global/entities/Payments';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Gym, Payments, UserGym, Calculate, Reviews]),
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
      // node: 'http://elasticsearch:9200',
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
