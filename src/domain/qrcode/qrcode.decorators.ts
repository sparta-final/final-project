import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export const CreateQRCode = () => {
  return applyDecorators(
    ApiOperation({ summary: 'QRCODE 생성' }),
    ApiBearerAuth('access-token'),
    ApiResponse({ status: 201, description: 'QRCODE 생성 성공' }),
    ApiResponse({ status: 400, description: 'QRCODE 생성 실패' })
  );
};

export const UseGym = () => {
  return applyDecorators(
    ApiOperation({ summary: '업체 이용' }),
    ApiBearerAuth('access-token'),
    ApiResponse({ status: 201, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};
