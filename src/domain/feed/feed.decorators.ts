import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const FeedPost = () => {
  return applyDecorators(
    ApiOperation({ summary: '피드 등록' }),
    ApiResponse({ status: 201, description: '피드가 등록되었습니다.' }),
    ApiBearerAuth('access-token'),
    ApiConsumes('multipart/form-data'),
    ApiResponse({ status: 400, description: '등록 실패' })
  );
};

export const AllFeedGet = () => {
  return applyDecorators(
    ApiOperation({ summary: '모든 피드 조회' }),
    ApiResponse({ status: 200, description: '피드 조회 완료.' }),
    ApiConsumes('multipart/form-data'),
    ApiResponse({ status: 400, description: '조회 실패' })
  );
};

export const MyFeedGet = () => {
  return applyDecorators(
    ApiOperation({ summary: '내 피드 조회' }),
    ApiResponse({ status: 200, description: '피드 조회 완료.' }),
    ApiBearerAuth('access-token'),
    ApiConsumes('multipart/form-data'),
    ApiResponse({ status: 400, description: '조회 실패' })
  );
};

export const FeedUpdate = () => {
  return applyDecorators(
    ApiOperation({ summary: '피드 수정' }),
    ApiResponse({ status: 200, description: '피드 수정 완료.' }),
    ApiBearerAuth('access-token'),
    ApiConsumes('multipart/form-data'),
    ApiResponse({ status: 400, description: '수정 실패' })
  );
};

export const FeedDelete = () => {
  return applyDecorators(
    ApiOperation({ summary: '피드 삭제' }),
    ApiResponse({ status: 200, description: '피드 삭제 완료.' }),
    ApiBearerAuth('access-token'),
    ApiResponse({ status: 400, description: '삭제 실패' })
  );
};
