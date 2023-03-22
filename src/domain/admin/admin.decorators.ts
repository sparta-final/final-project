import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';

export const getMembers = () => {
  return applyDecorators(
    ApiOperation({ summary: '멤버쉽 별 구독 회원 수 조회' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};

export const getApproveGyms = () => {
  return applyDecorators(
    ApiOperation({ summary: '승인된 제휴 가맹점 수 조회' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};

export const getBeforeApproveGyms = () => {
  return applyDecorators(
    ApiOperation({ summary: '승인대기중인 가맹점 조회' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};

export const approveGym = () => {
  return applyDecorators(
    ApiOperation({ summary: '승인 요청된 제휴가맹점 승인하기' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};

export const salesAll = () => {
  return applyDecorators(
    ApiOperation({ summary: '식스팩 누적 매출' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};

export const salesMonth = () => {
  return applyDecorators(
    ApiOperation({ summary: '식스팩 월 별 매출' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};

export const gymRank = () => {
  return applyDecorators(
    ApiOperation({ summary: '카테고리별 가맹점 순위' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};

export const calculate = () => {
  return applyDecorators(
    ApiOperation({ summary: '정산하기' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};

export const GetVisitUsers = () => {
  return applyDecorators(
    ApiOperation({ summary: '헬스장 월 별 방문자 조회' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};
export const CalculateGym = () => {
  return applyDecorators(
    ApiOperation({ summary: '헬스장 월 별 매출 조회' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};
