import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';

export const GetBusinessUserInfo = () => {
  return applyDecorators(
    ApiOperation({ summary: '사업자 유저 정보 조회' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '사업자 유저 정보 조회 성공' }),
    ApiResponse({ status: 400, description: '사업자 유저 정보 조회 실패' })
  );
};

export const UpdateBusinessUserInfo = () => {
  return applyDecorators(
    ApiOperation({ summary: '사업자 유저 정보 수정' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '사업자 유저 정보 수정 성공' }),
    ApiResponse({ status: 400, description: '사업자 유저 정보 수정 실패' })
  );
};

export const DeleteBusinessUserInfo = () => {
  return applyDecorators(
    ApiOperation({ summary: '사업자 유저 유저 탈퇴' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '사업자 유저 유저 탈퇴 성공' }),
    ApiResponse({ status: 400, description: '사업자 유저 유저 탈퇴 실패' })
  );
};

export const GetUserByGymId = () => {
  return applyDecorators(
    ApiOperation({ summary: '가맹점별 사용자 데이터 불러오기' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '가맹점별 사용자 데이터 불러오기 성공' }),
    ApiResponse({ status: 400, description: '가맹점별 사용자 데이터 불러오기 실패' })
  );
};
