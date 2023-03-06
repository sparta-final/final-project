import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { Public } from 'src/global/common/decorator/public.decorator';
import { JwtPayload } from '../auth/types/jwtPayload.type';
import { CreateFeedDto } from './dto/create-feeds.dto';
import { UpdateFeedDto } from './dto/update-feeds.dto';
import { AllFeedGet, FeedDelete, FeedPost, FeedUpdate, MyFeedGet } from './feed.decorators';
import { FeedService } from './feed.service';

@ApiTags('Feed')
@Controller('api/feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @FeedPost()
  @UseInterceptors(FileInterceptor('feedImg'))
  @Post()
  async postFeeds(
    @UploadedFile() file: Express.MulterS3.File,
    @CurrentUser() user: JwtPayload,
    @Body() createFeedDto: CreateFeedDto
  ) {
    const feed = await this.feedService.postFeeds({ file, user, createFeedDto });
    return feed;
  }

  @AllFeedGet()
  @Public()
  @Get()
  async getAllFeed() {
    return this.feedService.getAllFeed();
  }

  @MyFeedGet()
  @Get('/my')
  async getMyFeed(@CurrentUser() user: JwtPayload) {
    return this.feedService.getMyFeed(user);
  }

  @FeedUpdate()
  @Put('/:id')
  @UseInterceptors(FileInterceptor('feedImg'))
  async updateFeed(
    @Param('id') feedId: number,
    @UploadedFile() file: Express.MulterS3.File,
    @Body() updatefeedDto: UpdateFeedDto,
    @CurrentUser() user: JwtPayload
  ) {
    return await this.feedService.updateFeed({ feedId, file, updatefeedDto, user });
  }

  @FeedDelete()
  @Delete('/:id')
  async deleteFeed(@Param('id') feedId: number, @CurrentUser() user: JwtPayload) {
    return await this.feedService.deleteFeed({ feedId, user });
  }
}
