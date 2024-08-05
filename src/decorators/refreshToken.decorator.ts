import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

export const RefreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const refreshToken = request.headers.authorization?.split(' ')[1];
    if (!refreshToken) throw new ForbiddenException('Access Denied.');

    return refreshToken;
  },
);
