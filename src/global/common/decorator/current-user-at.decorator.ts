import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserRt = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers.authorization ?? null;
});
