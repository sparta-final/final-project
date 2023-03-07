import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const getMembers = () => {
  return applyDecorators(
    ApiOperation({ summary: '멤버십 별 구독 회원 수 조회' }),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};

export const getApproveGyms = () => {
  return applyDecorators(
    ApiOperation({ summary: '승인된 제휴 업체 수 조회' }),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};

export const approveGym = () => {
  return applyDecorators(
    ApiOperation({ summary: '승인 요청된 제휴업체 승인하기' }),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};

export const salesAll = () => {
  return applyDecorators(
    ApiOperation({ summary: '식스팩 누적 매출' }),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};

export const salesMonth = () => {
  return applyDecorators(
    ApiOperation({ summary: '식스팩 월 별 매출' }),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};
