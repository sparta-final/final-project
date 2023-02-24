import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

// interceptor : 데이터를 마지막에 한번 더 가공해주는 역할
@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 앞 부분(before)
    // --------------------
    // 뒷 부분(after) => 공통로직
    return next
      .handle()
      .pipe(map((data) => (data === undefined ? null : data)));
    // JSON은 undefined를 모르기 때문에 null로 바꿔주는 거
  }
}
