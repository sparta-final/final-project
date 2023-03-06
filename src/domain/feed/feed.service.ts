import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feeds } from 'src/global/entities/Feeds';
import { FeedsImg } from 'src/global/entities/FeedsImg';
import { DataSource, Repository } from 'typeorm';
import { JwtPayload } from '../auth/types/jwtPayload.type';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feeds) private feedsRepository: Repository<Feeds>,
    @InjectRepository(FeedsImg) private feedsImgRepository: Repository<FeedsImg>,
    private dataSource: DataSource
  ) {}

  /**
   * @description 피드 작성
   * @param user @param file @param createFeedDto
   * @author 정호준
   */
  async postFeeds({ file, user, createFeedDto }) {
    const createFeed = await this.feedsRepository.save({
      content: createFeedDto.content,
      userId: user.sub,
    });
    await this.feedsImgRepository.save({
      feedId: createFeed.id,
      image: file.location,
    });
  }

  /**
   * @description 모든 피드 조회
   * @author 정호준
   */
  async getAllFeed() {
    const allFeed = await this.feedsRepository.find({});
    return allFeed;
  }

  /**
   * @description 내 피드 조회
   * @param user
   * @author 정호준
   */
  async getMyFeed(user: JwtPayload) {
    const myFeed = await this.feedsRepository.find({
      where: { userId: user.sub },
    });
    return myFeed;
  }
  /**
   * @description 내 피드 수정
   * @param feedId @param file @param updatefeedDto @param user
   * @author 정호준
   */
  async updateFeed({ feedId, file, updatefeedDto, user }) {
    await this.checkUser(feedId, user);
    const existFeed = await this.feedsRepository.findOne({
      where: { id: feedId },
    });
    const findFeedImg = await this.feedsImgRepository.findOne({
      where: { feedId: feedId },
    });
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.feedsRepository.update(feedId, {
        content: updatefeedDto.content ? updatefeedDto.content : existFeed.content,
      });
      await this.feedsImgRepository.update(findFeedImg.id, {
        image: file ? file.location : findFeedImg.image,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @description 내 피드 삭제
   * @param feedId @param user
   * @author 정호준
   */
  async deleteFeed({ feedId, user }) {
    await this.checkUser(feedId, user);
    const findFeedImg = await this.feedsImgRepository.findOne({
      where: { feedId: feedId },
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.feedsImgRepository.delete(findFeedImg.id);
      await this.feedsRepository.delete(feedId);
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
}
