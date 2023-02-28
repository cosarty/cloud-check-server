import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserType } from '@/models/users';
import { ROLES_KEY, ROLES_TYPE } from '../role/role.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest() as Request & {
      user: { user: UserType };
    };
    //获取聚合装饰器中的元信息
    const role = this.reflector.get<ROLES_TYPE>(
      ROLES_KEY,
      context.getHandler(),
    );

    const validateRole = (role: ROLES_TYPE) => {
      if (user.user.auth === role || user.user.super) return true;
      if (role === 'admin') return user.user.isAdmin;
      return false;
    };

    if (!role) return true;
    if (typeof role === 'string') {
      return validateRole(role);
    }
    if (Array.isArray(role)) {
      return role.some((r) => validateRole(r));
    }

    return false;
  }
}
