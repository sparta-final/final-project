import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth, ApiOAuth2 } from '@nestjs/swagger';
import { Public } from 'src/global/common/decorator/public.decorator';

export const CompletePayment = () => {
  return applyDecorators(
    ApiOperation({ summary: '결제완료 데이터 (임시)' }),
    ApiResponse({ status: 201, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};

export const WebhookPayment = () => {
  return applyDecorators(
    ApiOperation({ summary: '정기결제 웹훅' }),
    ApiResponse({ status: 201, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};

export const UnsubscribePayment = () => {
  return applyDecorators(
    ApiOperation({ summary: '정기결제 취소' }),
    ApiResponse({ status: 201, description: '성공' }),
    ApiResponse({ status: 400, description: '실패' })
  );
};
