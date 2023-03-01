import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      // 인가
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      scope: ['account_email', 'profile_nickname'],
    });
  }
  // 인가 실패 -> 에러발생

  // 인가 성공하면 validate 함수 실행
  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    return {
      email: profile._json.kakao_account.email,
      name: profile.displayName,
    }; // => req.user
  }
}
