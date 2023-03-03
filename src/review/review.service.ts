import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  findReviewByGymId(gymId: number) {
    return `This action returns all review`;
  }

  postReview(gymId: number, createReviewDto: CreateReviewDto) {
    return 'This action adds a new review';
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(gymId: number, reviewId: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a  review`;
  }

  remove(gymId, reviewId) {
    return `This action removes a review`;
  }
}
