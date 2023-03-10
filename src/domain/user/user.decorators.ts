import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const GetUserInfo = () => {
  return applyDecorators(
    ApiOperation({ summary: '일반유저 정보 조회' }),
    ApiResponse({ status: 200, description: '일반유저 정보 조회 성공' }),
    ApiResponse({ status: 400, description: '일반유저 정보 조회 실패' })
  );
};

export const UpdateUserInfo = () => {
  return applyDecorators(
    ApiOperation({ summary: '일반유저 정보 수정' }),
    ApiResponse({ status: 200, description: '일반유저 정보 수정 성공' }),
    ApiResponse({ status: 400, description: '일반유저 정보 수정 실패' })
  );
};

export const DeleteUserInfo = () => {
  return applyDecorators(
    ApiOperation({ summary: '일반유저 탈퇴' }),
    ApiResponse({ status: 200, description: '일반유저 탈퇴 성공' }),
    ApiResponse({ status: 400, description: '일반유저 탈퇴 실패' })
  );
};
