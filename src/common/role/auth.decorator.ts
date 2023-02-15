import { RoleType } from './../../constants/authEnum';
import { AuthEnum } from '@/constants/authEnum';
import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role, ROLES_TYPE } from './role.decorator';
import { PoliciesGuard } from '../guard/policies.guard';

// 权限校验
export const Auth = (role?: ROLES_TYPE) =>
  applyDecorators(
    UseGuards(AuthGuard('jwt')),
    Role(role),
    UseGuards(PoliciesGuard),
  );

export const Admin = () => Auth(AuthEnum.ADMIN);
export const Teacher = () => Auth(AuthEnum.TEACHER);
export const Super = () => Auth(AuthEnum.SUPER);
export const Student = () => Auth(AuthEnum.STUDENT);
