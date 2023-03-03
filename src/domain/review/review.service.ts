import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reviews } from 'src/global/entities/Reviews';
import { UserGym } from 'src/global/entities/UserGym';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/types/jwtPayload.type';
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

  async postReview(gymId: number, user: JwtPayload, file: Express.MulterS3.File, createReviewDto: CreateReviewDto) {
    const userGym = await this.userGymRepo.findOne({
      where: { gymId, userId: user.sub },
    });
    if (!userGym) {
      throw new NotFoundException('리뷰를 작성할 수 없습니다');
    }
    const review = await this.reviewRepo.save({
      ...createReviewDto,
      img: file.location,
      userGym: { id: userGym.id },
    });
    return review;
  }

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
