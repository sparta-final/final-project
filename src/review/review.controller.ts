import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/global/common/decorator/public.decorator';
import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { findReviewByGymId } from './review.decorators';
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

  @Post('/:gymId/review')
  @Public()
  @UseInterceptors(FileInterceptor('reviewImg'))
  postReview(
    @Param('gymId') gymId: number,
    @UploadedFile() file: Express.MulterS3.File,
    @Body() createReviewDto: CreateReviewDto
  ) {
    return this.reviewService.postReview(gymId, file, createReviewDto);
  }

  // @Put('/:gymId/review/:reviewId')
  // update(@Param('gymId') gymId: number, @Param('reviewId') reviewId: number, @Body() updateReviewDto: UpdateReviewDto) {
  //   return this.reviewService.update(gymId, reviewId, updateReviewDto);
  // }

  // @Delete('/:gymId/review/:reviewId')
  // remove(@Param('gymId') gymId: number, @Param('reviewId') reviewId: number) {
  //   return this.reviewService.remove(gymId, reviewId);
  // }
}
