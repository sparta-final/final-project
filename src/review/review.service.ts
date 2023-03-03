import { UserGym } from './../global/entities/UserGym';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reviews } from 'src/global/entities/Reviews';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Reviews) private reviewRepo: Repository<Reviews>,
    @InjectRepository(UserGym) private userGymRepo: Repository<UserGym>
  ) {}
  async findReviewByGymId(gymId: number) {
    const reviews = await this.userGymRepo
      .createQueryBuilder('userGym')
      .leftJoinAndSelect('userGym.review', 'review')
      .where('userGym.gymId = :gymId', { gymId })
      .getMany();
    if (reviews.length === 0) {
      throw new NotFoundException('리뷰가 존재하지 않습니다');
    }
    return reviews;
  }

  // postReview(gymId: number, createReviewDto: CreateReviewDto) {
  //   return 'This action adds a new review';
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} review`;
  // }

  // update(gymId: number, reviewId: number, updateReviewDto: UpdateReviewDto) {
  //   return `This action updates a  review`;
  // }

  // remove(gymId, reviewId) {
  //   return `This action removes a review`;
  // }
}
