import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/global/common/decorator/public.decorator';
import { Controller, Get, Post, Body, Param, Delete, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { deleteReview, findReviewByGymId, postReview, updateReview } from './review.decorators';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { JwtPayload } from 'src/domain/auth/types/jwtPayload.type';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Review')
@Controller('api/gym')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Public()
  @findReviewByGymId()
  @Get('/:gymId/review')
  findReviewByGymId(@Param('gymId') gymId: number) {
    return this.reviewService.findReviewByGymId(gymId);
  }

  @postReview()
  @UseInterceptors(FileInterceptor('reviewImg'))
  @Post('/:gymId/review')
  postReview(
    @Param('gymId') gymId: number,
    @UploadedFile() file: Express.MulterS3.File,
    @CurrentUser() user: JwtPayload,
    @Body() createReviewDto: CreateReviewDto
  ) {
    console.log('file', file);
    return this.reviewService.postReview(gymId, user, file, createReviewDto);
  }

  @updateReview()
  @UseInterceptors(FileInterceptor('reviewImg'))
  @Put('/:gymId/review/:reviewId')
  updateReview(
    @Param('gymId') gymId: number,
    @Param('reviewId') reviewId: number,
    @UploadedFile() file: Express.MulterS3.File,
    @CurrentUser() user: JwtPayload,
    @Body() updateReviewDto: UpdateReviewDto
  ) {
    console.log('file', file);
    return this.reviewService.updateReview(gymId, reviewId, file, user, updateReviewDto);
  }

  @deleteReview()
  @Delete('/:gymId/review/:reviewId')
  removeReview(@Param('gymId') gymId: number, @Param('reviewId') reviewId: number, @CurrentUser() user: JwtPayload) {
    return this.reviewService.removeReview(gymId, reviewId, user);
  }
}
