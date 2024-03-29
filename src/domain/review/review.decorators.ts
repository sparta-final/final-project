import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiSecurity } from '@nestjs/swagger';

export const findReviewById = () => {
  return applyDecorators(
    ApiOperation({ summary: '리뷰 조회(상세조회)' }),
    ApiResponse({ status: 200, description: '리뷰조회 성공' }),
    ApiResponse({ status: 400, description: '리뷰조회 실패' })
  );
};

export const findMyReview = () => {
  return applyDecorators(
    ApiOperation({ summary: '리뷰 조회(회원별)' }),
    ApiResponse({ status: 200, description: '리뷰조회 성공' }),
    ApiResponse({ status: 400, description: '리뷰조회 실패' })
  );
};

export const findReviewByGymId = () => {
  return applyDecorators(
    ApiOperation({ summary: '리뷰 조회(가맹점별)' }),
    ApiResponse({ status: 200, description: '리뷰조회 성공' }),
    ApiResponse({ status: 400, description: '리뷰조회 실패' })
  );
};

export const postReview = () => {
  return applyDecorators(
    ApiOperation({ summary: '리뷰 작성' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiConsumes('multipart/form-data'),
    ApiResponse({ status: 201, description: '리뷰작성 성공' }),
    ApiResponse({ status: 400, description: '리뷰작성 실패' })
  );
};

export const updateReview = () => {
  return applyDecorators(
    ApiOperation({ summary: '리뷰 수정' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiConsumes('multipart/form-data'),
    ApiResponse({ status: 201, description: '리뷰수정 성공' }),
    ApiResponse({ status: 400, description: '리뷰수정 실패' })
  );
};

export const deleteReview = () => {
  return applyDecorators(
    ApiOperation({ summary: '리뷰 삭제' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 201, description: '리뷰삭제 성공' }),
    ApiResponse({ status: 400, description: '리뷰삭제 실패' })
  );
};
