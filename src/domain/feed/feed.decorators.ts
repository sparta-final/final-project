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

export const CommentPost = () => {
  return applyDecorators(
    ApiOperation({ summary: '피드 댓글 생성' }),
    ApiResponse({ status: 201, description: '생성 완료.' }),
    ApiBearerAuth('access-token'),
    ApiResponse({ status: 400, description: '생성 실패' })
  );
};

export const CommentUserGet = () => {
  return applyDecorators(
    ApiOperation({ summary: '피드 작성자 조회' }),
    ApiResponse({ status: 200, description: '조회 완료.' }),
    ApiResponse({ status: 400, description: '조회 실패' })
  );
};

export const AllCommentGet = () => {
  return applyDecorators(
    ApiOperation({ summary: '피드 댓글 조회' }),
    ApiResponse({ status: 200, description: '조회 완료.' }),
    ApiResponse({ status: 400, description: '조회 실패' })
  );
};

export const UpdateComment = () => {
  return applyDecorators(
    ApiOperation({ summary: '피드 댓글 수정' }),
    ApiResponse({ status: 200, description: '수정 완료.' }),
    ApiBearerAuth('access-token'),
    ApiResponse({ status: 400, description: '수정 실패' })
  );
};

export const DeleteComment = () => {
  return applyDecorators(
    ApiOperation({ summary: '피드 댓글 삭제' }),
    ApiResponse({ status: 200, description: '삭제 완료.' }),
    ApiBearerAuth('access-token'),
    ApiResponse({ status: 400, description: '삭제 실패' })
  );
};
