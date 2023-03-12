import { CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reviews } from 'src/global/entities/Reviews';
import { UserGym } from 'src/global/entities/UserGym';
import { DataSource, Repository } from 'typeorm';
import { JwtPayload } from '../auth/types/jwtPayload.type';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Reviews) private reviewRepo: Repository<Reviews>,
    @InjectRepository(UserGym) private userGymRepo: Repository<UserGym>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private dataSource: DataSource
  ) {}

  /**
   * @description 리뷰 조회
   * @author 김승일
   * @param gymId
   */
  async findReviewByGymId(gymId: number) {
    const cachedReviews = await this.cacheManager.get(`reviews:GymID: ${gymId}`);
    if (cachedReviews) return cachedReviews;

    const reviews = await this.userGymRepo
      .createQueryBuilder('userGym')
      .leftJoinAndSelect('userGym.reviews', 'reviews', 'reviews.userGym.id = userGym.id')
      .leftJoinAndSelect('userGym.user', 'user', 'user.id = userGym.userId')
      .where('userGym.gymId = :gymId', { gymId })
      .getMany();

    // reviews 평균 평점 계산
    let sum = 0;
    let avgStar = 0;
    reviews.forEach((review) => {
      sum += review.reviews[0].star;
      avgStar = Math.round((sum / reviews.length) * 10) / 10;
    });

    await this.cacheManager.set(`reviews:GymID: ${gymId}`, { reviews, avgStar }, { ttl: 30 });
    return { reviews, avgStar };
  }

  /**
   * @description 리뷰 작성
   * @param gymId @argument user @argument file @argument createReviewDto
   * @author 김승일
   */
  async postReview(gymId: number, user: JwtPayload, file: Express.MulterS3.File, createReviewDto: CreateReviewDto) {
    // NOTE : 최근에 간 헬스장인지 확인하여 그 건에 대해 리뷰를 작성할 수 있도록 함
    const userGym = await this.userGymRepo.findOne({
      where: { gymId, userId: user.sub, reviewId: null },
      order: { id: 'DESC' },
    });
    if (!userGym) {
      throw new UnauthorizedException('리뷰를 작성할 수 없습니다');
    }
    // 트랜잭션 처리
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const review = await queryRunner.manager.getRepository(Reviews).save({
        ...createReviewDto,
        reviewImg: file.location,
        userGym: { id: userGym.id },
      });
      await queryRunner.manager.getRepository(UserGym).update({ id: userGym.id }, { reviewId: review.id });
      await queryRunner.commitTransaction();
      return review;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @description 리뷰 수정
   * @param gymId @param reviewId @argument file @argument user @argument updateReviewDto
   * @author 김승일
   */
  async updateReview(
    gymId: number,
    reviewId: number,
    file: Express.MulterS3.File,
    user: JwtPayload,
    updateReviewDto: UpdateReviewDto
  ) {
    const userGym = await this.userGymRepo.findOne({
      where: { gymId, userId: user.sub, reviewId },
    });
    if (!userGym) throw new UnauthorizedException('리뷰를 수정할 수 없습니다');

    const existReview = await this.reviewRepo.findOne({
      where: { id: reviewId, userGym: { id: userGym.id } },
    });
    const updateReview = await this.reviewRepo.update(
      { id: reviewId, userGym: { id: userGym.id } },
      {
        review: updateReviewDto.review ? updateReviewDto.review : existReview.review,
        star: updateReviewDto.star ? updateReviewDto.star : existReview.star,
        reviewImg: file ? file.location : existReview.reviewImg,
      }
    );

    return updateReview;
  }

  /**
   * @description 리뷰 삭제
   * @author 김승일
   * @param gymId @param reviewId @param user
   */
  async removeReview(gymId: number, reviewId: number, user: JwtPayload) {
    const userGym = await this.userGymRepo.findOne({
      where: { gymId, userId: user.sub, reviewId },
    });
    if (!userGym) throw new UnauthorizedException('리뷰를 삭제할 수 없습니다');
    // 리뷰삭제는 hard-delete
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager
        .getRepository(Reviews)
        .createQueryBuilder('review')
        .delete()
        .from(Reviews)
        .where('id = :id', { id: reviewId })
        .andWhere('userGym.id = :userGymId', { userGymId: userGym.id })
        .execute();
      await queryRunner.manager.getRepository(UserGym).update({ id: userGym.id }, { reviewId: null });
      await queryRunner.commitTransaction();
      return { message: '리뷰가 삭제되었습니다' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
