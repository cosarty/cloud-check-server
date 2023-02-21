import { RoleType } from '@/constants/authEnum';
import { User } from '@/models/users';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * 校验用户
 */
@ValidatorConstraint()
export class VrifyUserRule implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    if (!value) return false;
    const identity = args.constraints[0] as RoleType;
    const user = await User.findOne({ where: { userId: value } });
    if (!user || user.auth !== identity) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return '不存在此教师';
  }
}
