import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth, ApiOAuth2 } from '@nestjs/swagger';
import { Public } from 'src/global/common/decorator/public.decorator';

export const UserSignup = () => {
  return applyDecorators(
    ApiOperation({ summary: '일반유저 회원가입' }),
    ApiResponse({ status: 201, description: '회원가입 성공' }),
    ApiResponse({ status: 400, description: '회원가입 실패' })
  );
};

export const BusinessUserSignup = () => {
  return applyDecorators(
    ApiOperation({ summary: '사업자 회원가입' }),
    ApiResponse({ status: 201, description: '회원가입 성공' }),
    ApiResponse({ status: 400, description: '회원가입 실패' })
  );
};

export const UserLogin = () => {
  return applyDecorators(
    ApiOperation({ summary: '일반유저 로그인' }),
    ApiResponse({ status: 201, description: '로그인 성공' }),
    ApiResponse({ status: 400, description: '로그인 실패' })
  );
};

export const BusinessUserLogin = () => {
  return applyDecorators(
    ApiOperation({ summary: '사업자 로그인' }),
    ApiResponse({ status: 201, description: '로그인 성공' }),
    ApiResponse({ status: 400, description: '로그인 실패' })
  );
};

export const KakaoLogin = () => {
  return applyDecorators(
    ApiOperation({ summary: '카카오 로그인' }),
    ApiResponse({ status: 201, description: '로그인 성공' }),
    ApiResponse({ status: 400, description: '로그인 실패' }),
    ApiOAuth2(['kakao'], 'kakao'), // TODO : 스웨거에서 되는지 확인 후 수정 필요
    UseGuards(AuthGuard('kakao'))
  );
};

export const UserRefreshToken = () => {
  return applyDecorators(
    ApiOperation({ summary: '토큰 재발급(일반유저)' }),
    ApiHeader({
      name: 'Authorization',
      schema: {
        type: 'string',
        example: 'bearer {accessToken}',
      },
    }),
    ApiBearerAuth('access-token'),
    ApiResponse({ status: 201, description: '토큰 재발급 성공' }),
    ApiResponse({ status: 400, description: '토큰 재발급 실패' })
  );
};

export const BusinessUserRefreshToken = () => {
  return applyDecorators(
    ApiOperation({ summary: '토큰 재발급(사업자)' }),
    ApiHeader({
      name: 'Authorization',
      schema: {
        type: 'string',
        example: 'bearer {accessToken}',
      },
    }),
    ApiBearerAuth('access-token'),
    ApiResponse({ status: 201, description: '토큰 재발급 성공' }),
    ApiResponse({ status: 400, description: '토큰 재발급 실패' })
  );
};
