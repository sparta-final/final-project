import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reviews } from 'src/global/entities/Reviews';
import { UserGym } from 'src/global/entities/UserGym';

@Module({
  imports: [TypeOrmModule.forFeature([Reviews, UserGym])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
