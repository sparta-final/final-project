import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/global/common/decorator/public.decorator';
import { Controller, Get, Post, Body, Param, Delete, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { deleteReview, findMyReview, findReviewByGymId, findReviewById, postReview, updateReview } from './review.decorators';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { JwtPayload } from 'src/domain/auth/types/jwtPayload.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Review')
@Controller('api')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @findReviewById()
  @Get('/review/:reviewId')
  findReviewById(@Param('reviewId') reviewId: number) {
    return this.reviewService.findReviewById(reviewId);
  }

  @findMyReview()
  @Get('/review')
  findMyReview(@CurrentUser() user: JwtPayload) {
    return this.reviewService.findReviewByUserId(user);
  }

  @Public()
  @findReviewByGymId()
  @Get('/gym/:gymId/review')
  findReviewByGymId(@Param('gymId') gymId: number) {
    return this.reviewService.findReviewByGymId(gymId);
  }

  @postReview()
  @UseInterceptors(FileInterceptor('reviewImg'))
  @Post('/gym/:usergymId/review')
  postReview(
    @Param('usergymId') usergymId: number,
    @UploadedFile() file: Express.MulterS3.File,
    @CurrentUser() user: JwtPayload,
    @Body() createReviewDto: CreateReviewDto
  ) {
    return this.reviewService.postReview(usergymId, user, file, createReviewDto);
  }

  @updateReview()
  @UseInterceptors(FileInterceptor('reviewImg'))
  @Put('/gym/:gymId/review/:reviewId')
  updateReview(
    @Param('gymId') gymId: number,
    @Param('reviewId') reviewId: number,
    @UploadedFile() file: Express.MulterS3.File,
    @CurrentUser() user: JwtPayload,
    @Body() updateReviewDto: UpdateReviewDto
  ) {
    return this.reviewService.updateReview(gymId, reviewId, file, user, updateReviewDto);
  }

  @deleteReview()
  @Delete('/review/:reviewId')
  removeReview(@Param('reviewId') reviewId: number, @CurrentUser() user: JwtPayload) {
    return this.reviewService.removeReview(reviewId, user);
  }
}
