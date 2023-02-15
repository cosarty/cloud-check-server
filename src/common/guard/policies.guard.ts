import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserType } from 'types/models';
import { ROLES_KEY, ROLES_TYPE } from '../role/role.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest() as Request & {
      user: UserType;
    };
    //获取聚合装饰器中的元信息
    const role = this.reflector.get<ROLES_TYPE>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!role) return true;
    if (typeof role === 'string') {
      return user.auth === role;
    }
    if (Array.isArray(role)) {
      return role.includes(user.auth);
    }

    return false;
  }
}
