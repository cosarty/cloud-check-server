import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserType } from '@/models/users';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.user as UserType;
  },
);
