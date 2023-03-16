import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { Public } from 'src/global/common/decorator/public.decorator';
import { JwtPayload } from '../auth/types/jwtPayload.type';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateFeedDto } from './dto/create-feeds.dto';
import { InfinityDto } from './dto/infinity.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UpdateFeedDto } from './dto/update-feeds.dto';
import {
  AllCommentGet,
  AllFeedGet,
  CommentPost,
  CommentUserGet,
  DeleteComment,
  FeedDelete,
  FeedPost,
  FeedUpdate,
  MyFeedGet,
  UpdateComment,
} from './feed.decorators';
import { FeedService } from './feed.service';

@ApiTags('Feed')
@Controller('api/feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @FeedPost()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'feedImg', maxCount: 10 }]))
  @Post()
  async postFeeds(
    @UploadedFiles() file: { feedImg: Express.MulterS3.File[] },
    @CurrentUser() user: JwtPayload,
    @Body() createFeedDto: CreateFeedDto
  ) {
    console.log('✨✨✨', file, '✨✨✨');
    const feed = await this.feedService.postFeeds({ file, user, createFeedDto });
    return feed;
  }

  @AllFeedGet()
  @Public()
  @Get()
  // async getAllFeed(@Param() data: InfinityDto) {
  async getAllFeed() {
    return this.feedService.getAllFeed();
  }

  @MyFeedGet()
  @Get('/my')
  async getMyFeed(@CurrentUser() user: JwtPayload) {
    return this.feedService.getMyFeed(user);
  }

  // @FeedGetUpdate()
  @Get('/:id')
  @Public()
  async updateGetFeed(@Param('id') id: number) {
    return await this.feedService.updateGetFeed(id);
  }

  @FeedUpdate()
  @Put('/:id')
  @UseInterceptors(FileInterceptor('feedImg'))
  async updateFeed(
    @Param('id') id: number,
    // @UploadedFile() file: Express.MulterS3.File,
    @Body() updatefeedDto: UpdateFeedDto,
    @CurrentUser() user: JwtPayload
  ) {
    return await this.feedService.updateFeed({ id, updatefeedDto, user });
  }

  @FeedDelete()
  @Delete('/:id')
  async deleteFeed(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    console.log('✨✨✨', '1', id, user, '✨✨✨');
    return await this.feedService.deleteFeed({ id, user });
  }

  @CommentPost()
  @Post('/:feedId/comment')
  async postComment(
    @Param('feedId') feedId: string,
    @Body() createcommentDto: CreateCommentDto,
    @CurrentUser() user: JwtPayload
  ) {
    console.log('✨✨✨', feedId, createcommentDto, user, '✨✨✨');
    const comment = await this.feedService.postComment({ feedId, createcommentDto, user });
    return comment;
  }

  @CommentUserGet()
  @Public()
  @Get('/:feedId/user')
  async getCommentUser(@Param('feedId') feedId: string) {
    return await this.feedService.getCommentUser(feedId);
  }

  @AllCommentGet()
  @Public()
  @Get('/:feedId/comment')
  async getAllComment(@Param('feedId') feedId: string) {
    return await this.feedService.getAllComment(feedId);
  }

  @UpdateComment()
  @Put('/:feedId/comment/:commentId')
  async updateComment(
    @Param('feedId') feedId: string,
    @Param('commentId') commentId: string,
    @Body() updatecommentDto: UpdateCommentDto,
    @CurrentUser() user: JwtPayload
  ) {
    const commentUpdate = await this.feedService.updateComment({ feedId, commentId, updatecommentDto, user });
    return commentUpdate;
  }

  @DeleteComment()
  @Delete('/:feedId/comment/:commentId')
  async deleteComment(@Param('feedId') feedId: string, @Param('commentId') commentId: string, @CurrentUser() user: JwtPayload) {
    const commentDelete = await this.feedService.deleteComment({ feedId, commentId, user });
    return commentDelete;
  }
}
