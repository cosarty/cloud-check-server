import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserType } from 'types/models';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.user;
  },
);
