import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('api/gym')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/:gymId/review')
  findReviewByGymId(@Param('gymId') gymId: number) {
    return this.reviewService.findReviewByGymId(gymId);
  }

  @Post('/:gymId/review')
  postReview(@Param('gymId') gymId: number, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.postReview(gymId, createReviewDto);
  }

  @Put('/:gymId/review/:reviewId')
  update(@Param('gymId') gymId: number, @Param('reviewId') reviewId: number, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(gymId, reviewId, updateReviewDto);
  }

  @Delete('/:gymId/review/:reviewId')
  remove(@Param('gymId') gymId: number, @Param('reviewId') reviewId: number) {
    return this.reviewService.remove(gymId, reviewId);
  }
}
