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
    const at = request.headers['accesstoken'];
    const rt = request.headers['refreshtoken'];

    const atCheck = await this.authService.checkAcessTokenExpired(at);
    const rtCheck = await this.authService.checkRefreshTokenExpired(rt);

    // at 만료된 경우
    if (!atCheck) {
      // rt 만료된 경우
      if (!rtCheck) {
        return false;
      } else {
        // rt 유효한 경우
        const newAccessToken = await this.authService.restoreRefreshToken(rtCheck, rt);
        request.headers['accesstoken'] = newAccessToken.AccessToken;
      }
    }
    return super.canActivate(context) as Promise<boolean>;
  }
}
export { AuthGuard };

