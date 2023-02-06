import { RoleType } from '@/constants/authEnum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export type ROLES_TYPE = RoleType | RoleType[];

// 设置权限
export const Role = (role: ROLES_TYPE) => SetMetadata(ROLES_KEY, role);
