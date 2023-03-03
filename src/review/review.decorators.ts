import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth, ApiOAuth2 } from '@nestjs/swagger';

export const findReviewByGymId = () => {
  return applyDecorators(
    ApiOperation({ summary: '리뷰 조회' }),
    ApiResponse({ status: 201, description: '리뷰조회 성공' }),
    ApiResponse({ status: 400, description: '리뷰조회 실패' })
  );
};
