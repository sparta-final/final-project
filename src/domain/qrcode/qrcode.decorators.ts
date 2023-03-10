import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

export const CreateQRCode = () => {
  return applyDecorators(
    ApiOperation({ summary: 'QRCODE 생성' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 201, description: 'QRCODE 생성 성공' }),
    ApiResponse({ status: 400, description: 'QRCODE 생성 실패' })
  );
};

export const UseGym = () => {
  return applyDecorators(
    ApiOperation({ summary: '가맹점 이용' }),
    ApiSecurity('accesstoken'),
    ApiSecurity('refreshtoken'),
    ApiResponse({ status: 201, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};
export const GetUseHistory = () => {
  return applyDecorators(
    ApiOperation({ summary: '이용 정보' }),
    ApiResponse({ status: 201, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};
