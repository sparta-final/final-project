import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/global/common/decorator/public.decorator';
import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { deleteReview, findReviewByGymId, postReview, updateReview } from './review.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { JwtPayload } from 'src/domain/auth/types/jwtPayload.type';

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

  @UseInterceptors(FileInterceptor('reviewImg'))
  @postReview()
  @Post('/:gymId/review')
  postReview(
    @Param('gymId') gymId: number,
    @UploadedFile() file: Express.MulterS3.File,
    @CurrentUser() user: JwtPayload,
    @Body() createReviewDto: CreateReviewDto
  ) {
    return this.reviewService.postReview(gymId, user, file, createReviewDto);
  }

  @UseInterceptors(FileInterceptor('reviewImg'))
  @updateReview()
  @Put('/:gymId/review/:reviewId')
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
  @Delete('/:gymId/review/:reviewId')
  removeReview(@Param('gymId') gymId: number, @Param('reviewId') reviewId: number, @CurrentUser() user: JwtPayload) {
    return this.reviewService.removeReview(gymId, reviewId, user);
  }
}
