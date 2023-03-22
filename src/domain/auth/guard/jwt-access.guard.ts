import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAccessGuard extends AuthGuard('access') {
  constructor(private reflector: Reflector, private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers['accesstoken'];
    const refreshToken = request.headers['refreshtoken'];

    const isAccessTokenValid = await this.authService.checkAcessTokenExpired(accessToken);
    const isRefreshTokenValid = await this.authService.checkRefreshTokenExpired(refreshToken);

    // access token이 유효한 경우
    if (isAccessTokenValid) {
      return super.canActivate(context) as Promise<boolean>;
    } else {
      // access token이 만료된 경우
      // refresh token이 유효한 경우
      if (isRefreshTokenValid) {
        const newAccessToken = await this.authService.restoreRefreshToken(isRefreshTokenValid, refreshToken);
        request.headers['accesstoken'] = newAccessToken.AccessToken;
        return super.canActivate(context) as Promise<boolean>;
      } else {
        // refresh token도 만료된 경우
        return false;
      }
    }
  }
}
export { AuthGuard };
