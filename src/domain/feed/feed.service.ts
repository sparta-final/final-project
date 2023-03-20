import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/global/entities/Comments';
import { Feeds } from 'src/global/entities/Feeds';
import { FeedsImg } from 'src/global/entities/FeedsImg';
import { DataSource, Repository } from 'typeorm';
import { JwtPayload } from '../auth/types/jwtPayload.type';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feeds) private feedsRepository: Repository<Feeds>,
    @InjectRepository(FeedsImg) private feedsImgRepository: Repository<FeedsImg>,
    @InjectRepository(Comments) private commentsRepository: Repository<Comments>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private dataSource: DataSource
  ) {}

  /**
   * @description 피드 작성
   * @param user @param file @param createFeedDto
   * @author 정호준
   */
  async postFeeds({ file, user, createFeedDto }) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createFeed = await this.feedsRepository.save({
        content: createFeedDto.content,
        userId: user.sub,
      });
      const feedImgs = [];
      for (let i = 0; i < file.feedImg.length; i++) {
        feedImgs.push({ feedId: createFeed.id, image: file.feedImg[i].transforms[0].location });
      }
      const createImg = await this.feedsImgRepository.insert(feedImgs);
      // await this.feedsImgRepository.save({
      //   feedId: createFeed.id,
      //   image: file.location,
      // });

      // Feed를 포함한 캐시 삭제
      const FeedCaches = await this.cacheManager.store.keys('Feed*');
      if (FeedCaches.length > 0) await this.cacheManager.store.del(FeedCaches);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @description 모든 피드 조회
   * @author 정호준, 한정훈
   */
  async getAllFeed() {
    const cachedallFeed = await this.cacheManager.get('Feed:allFeed');
    if (cachedallFeed) return cachedallFeed;
    const allFeed = await this.feedsRepository
      .createQueryBuilder('feeds')
      .leftJoinAndSelect('feeds.user', 'user')
      .leftJoinAndSelect('feeds.feedsImgs', 'feedsImgs')
      // .select(['user.nickname'])
      .select(['feeds', 'feedsImgs.image', 'user.nickname', 'user.profileImage'])
      .orderBy({ 'feeds.id': 'DESC' })
      // .skip(Number(data.offset))
      // .take(Number(data.offset) + Number(data.limit))
      .getMany();
    // .getRawMany();
    // const allFeed = await this.feedsRepository.find({
    //   relations: ['feedsImgs', 'user'],
    //   order: { id: 'DESC' },
    // });
    await this.cacheManager.set('Feed:allFeed', allFeed, { ttl: 60 });

    return allFeed;
  }

  /**
   * @description 내 피드 조회
   * @param user
   * @author 정호준
   */
  async getMyFeed(user: JwtPayload) {
    const cachedMyFeed = await this.cacheManager.get(`Feed:myFeed:${user.sub}`);
    if (cachedMyFeed) return cachedMyFeed;

    const myFeed = await this.feedsRepository.find({
      where: { userId: user.sub },
      relations: ['feedsImgs'],
    });
    await this.cacheManager.set(`Feed:myFeed:${user.sub}`, myFeed, { ttl: 60 });

    return myFeed;
  }

  /**
   * @description 내 피드 데이터 가져오기
   * @argument id
   * @author 한정훈
   */
  async updateGetFeed(id) {
    const cachedMyFeedData = await this.cacheManager.get(`Feed:myFeedData:${id}`);
    if (cachedMyFeedData) return cachedMyFeedData;

    const myfeedData = await this.feedsRepository.findOne({
      where: { id: id },
      relations: ['feedsImgs'],
    });
    await this.cacheManager.set(`Feed:myFeedData:${id}`, myfeedData, { ttl: 60 });

    return myfeedData;
  }

  /**
   * @description 내 피드 수정
   * @param feedId
   * @param updatefeedDto
   * @author 정호준
   */
  async updateFeed({ id, updatefeedDto, user }) {
    await this.checkUser(id, user);
    await this.feedsRepository.update(id, {
      content: updatefeedDto.content,
    });

    // Feed를 포함한 캐시 삭제
    const FeedCaches = await this.cacheManager.store.keys('Feed*');
    if (FeedCaches.length > 0) await this.cacheManager.store.del(FeedCaches);

    // 이미지 함께 수정 가능하게 하려면 위에 코드 대신 아래코드 작성
    // const existFeed = await this.feedsRepository.findOne({
    //   where: { id: feedId },
    // });
    // const findFeedImg = await this.feedsImgRepository.findOne({
    //   where: { feedId: feedId },
    // });
    // const queryRunner = this.dataSource.createQueryRunner();

    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    // try {
    //   await this.feedsRepository.update(feedId, {
    //     content: updatefeedDto.content ? updatefeedDto.content : existFeed.content,
    //   });
    //   await this.feedsImgRepository.update(findFeedImg.id, {
    //     image: file ? file.location : findFeedImg.image,
    //   });
    //   await queryRunner.commitTransaction();
    // } catch (err) {
    //   await queryRunner.rollbackTransaction();
    //   throw err;
    // } finally {
    //   await queryRunner.release();
    // }
  }

  /**
   * @description 내 피드 삭제
   * @param feedId @param user
   * @author 정호준
   */
  async deleteFeed({ id, user }) {
    await this.checkUser(id, user);
    const findFeedImg = await this.feedsImgRepository.findOne({
      where: { feedId: id },
    });
    const findComment = await this.commentsRepository.findOne({
      where: { feedId: id },
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    //TODO: 댓글삭제 시 한개만 삭제가 아닌 feedId를 가진 전체 삭제 구현해야 함
    try {
      await this.feedsImgRepository.delete(findFeedImg.id);
      if (findComment) {
        await this.commentsRepository.delete(findComment.id);
      }
      await this.feedsRepository.delete(id);

      // Feed를 포함한 캐시 삭제
      const FeedCaches = await this.cacheManager.store.keys('Feed*');
      if (FeedCaches.length > 0) await this.cacheManager.store.del(FeedCaches);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 유저 확인
   * @author 정호준
   */
  private async checkUser(feedId, user) {
    const feed = await this.feedsRepository.findOne({
      where: { id: feedId },
    });

    if (user.sub !== feed.userId) throw new UnauthorizedException('글쓴이가 아닙니다.');
  }

  /**
   * @description 피드 댓글 작성
   * @param user @param feedId @param createcommentDto
   * @author 정호준
   */
  async postComment({ feedId, createcommentDto, user }) {
    if (!user) throw new UnauthorizedException('로그인이 필요합니다.');
    await this.checkFeed(feedId);

    const createComment = await this.commentsRepository.insert({
      feedId: feedId,
      userId: user.sub,
      ...createcommentDto,
    });

    // Feed를 포함한 캐시 삭제
    const FeedCaches = await this.cacheManager.store.keys('Feed*');
    if (FeedCaches.length > 0) await this.cacheManager.store.del(FeedCaches);

    return createComment;
  }

  /**
   * @description 피드 작성자 조회
   * @param feedId
   * @author 정호준
   */
  async getCommentUser(feedId) {
    const cachedCommentUser = await this.cacheManager.get(`Feed:commentUser:${feedId}`);
    if (cachedCommentUser) return cachedCommentUser;

    const feedWriter = await this.feedsRepository
      .createQueryBuilder('feeds')
      .leftJoinAndSelect('feeds.user', 'user')
      .where('feeds.id = :feedId', { feedId })
      .select(['feeds', 'user.nickname', 'user.profileImage'])
      .getRawMany();

    await this.cacheManager.set(`Feed:commentUser:${feedId}`, feedWriter, { ttl: 60 });

    return feedWriter;
  }

  /**
   * @description 피드 댓글 조회
   * @param feedId
   * @author  한정훈
   */
  async getAllComment(feedId) {
    const cachedComment = await this.cacheManager.get(`Feed:comment:${feedId}`);
    if (cachedComment) return cachedComment;

    const feedComments = await this.commentsRepository
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.user', 'user')
      .leftJoinAndSelect('comments.feed', 'feed')
      .where('comments.feedId = :feedId', { feedId })
      .select(['comments', 'user.nickname', 'user.profileImage', 'feed.content', 'feed.userId'])
      .getRawMany();

    await this.cacheManager.set(`Feed:comment:${feedId}`, feedComments, { ttl: 60 });

    return feedComments;
  }
  /**
   * @description 피드 댓글 수정
   * @param feedId @param commentId @param updatecommentDto @param user
   * @author 정호준
   */
  async updateComment({ feedId, commentId, updatecommentDto, user }) {
    await this.checkFeed(feedId);
    const existComment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });
    if (existComment.userId !== user.sub) throw new UnauthorizedException('글쓴이가 아닙니다.');
    const commentUpdate = await this.commentsRepository.update(commentId, {
      comment: updatecommentDto.comment ? updatecommentDto.comment : existComment.comment,
    });

    // Feed를 포함한 캐시 삭제
    const FeedCaches = await this.cacheManager.store.keys('Feed*');
    if (FeedCaches.length > 0) await this.cacheManager.store.del(FeedCaches);

    return commentUpdate;
  }

  /**
   * @description 피드 댓글 삭제
   * @param feedId @param commentId @param updatecommentDto @param user
   * @author 정호준
   */
  async deleteComment({ feedId, commentId, user }) {
    await this.verifyUser(commentId, user);
    await this.checkFeed(feedId);
    const commentDelete = await this.commentsRepository.delete(commentId);

    // Feed를 포함한 캐시 삭제
    const FeedCaches = await this.cacheManager.store.keys('Feed*');
    if (FeedCaches.length > 0) await this.cacheManager.store.del(FeedCaches);

    return commentDelete;
  }

  /**
   * @description 피드 에러 처리
   * @param feedId
   * @author 정호준
   */
  private async checkFeed(feedId) {
    const existfeed = await this.feedsRepository.findOne({
      where: { id: feedId },
    });
    if (!existfeed) throw new NotFoundException('피드가 존재하지 않습니다');
  }

  /**
   * @description 유저 에러 처리
   * @param user
   * @author 정호준
   */
  private async verifyUser(commentId, user) {
    const existComment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });
    if (existComment.userId !== user.sub) throw new UnauthorizedException('글쓴이가 아닙니다.');
  }
}
