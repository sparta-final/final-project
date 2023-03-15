import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiSecurity } from '@nestjs/swagger';

export const GymSignup = () => {
  return applyDecorators(
    ApiOperation({ summary: '체육관 등록' }),
    ApiResponse({ status: 201, description: '체육관이 등록되었습니다.' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiConsumes('multipart/form-data'),
    ApiResponse({ status: 400, description: '등록 실패' })
  );
};

export const MyGymGet = () => {
  return applyDecorators(
    ApiOperation({ summary: '내 체육관 조회' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '조회 성공' }),
    ApiResponse({ status: 400, description: '조회 실패' })
  );
};

export const GymUpdate = () => {
  return applyDecorators(
    ApiOperation({ summary: '체육관 정보 수정' }),
    ApiSecurity('accesstoken'),
    ApiConsumes('multipart/form-data'),
    ApiResponse({ status: 200, description: '수정 성공' }),
    ApiResponse({ status: 400, description: '수정 실패' })
  );
};

export const GymDelete = () => {
  return applyDecorators(
    ApiOperation({ summary: '체육관 삭제' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 200, description: '삭제 성공' }),
    ApiResponse({ status: 400, description: '삭제 실패' })
  );
};

export const GetAllGym = () => {
  return applyDecorators(
    ApiOperation({ summary: '전체 체육관 조회' }),
    ApiResponse({ status: 200, description: '조회 성공' }),
    ApiResponse({ status: 400, description: '조회 실패' })
  );
};

export const GetById = () => {
  return applyDecorators(
    ApiOperation({ summary: ' 체육관 하나 조회' }),
    ApiResponse({ status: 200, description: '조회 성공' }),
    ApiResponse({ status: 400, description: '조회 실패' })
  );
};

export const SearchGymByText = () => {
  return applyDecorators(
    ApiOperation({ summary: ' 체육관 앞글자로 조회' }),
    ApiResponse({ status: 200, description: '조회 성공' }),
    ApiResponse({ status: 400, description: '조회 실패' })
  );
};
export const ApproveGymGet = () => {
  return applyDecorators(
    ApiOperation({ summary: ' 승인된 체육관 조회' }),
    ApiResponse({ status: 200, description: '조회 성공' }),
    ApiResponse({ status: 400, description: '조회 실패' })
  );
};
