import { RoleType } from '@/constants/authEnum';
import { User } from '@/models/users';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * 校验身份
 */
@ValidatorConstraint()
export class VrifyIdentity implements ValidatorConstraintInterface {
  async validate(value: string | string[], args: ValidationArguments) {
    if (!value) return false;
    const identity = args.constraints[0] as RoleType | 'all';
    value = Array.isArray(value) ? value : [value];
    const user = await User.findAll({
      where: {
        userId: value,
        isBan: false,
        ...(identity === 'all' ? {} : { auth: identity }),
      },
    });
    if (user.length === 0) return false;
    return user.length === value.length;
  }

  defaultMessage(args: ValidationArguments) {
    return '不存在此教师';
  }
}
