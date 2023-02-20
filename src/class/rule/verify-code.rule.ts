import { RoleType } from '@/constants/authEnum';
import { Class } from '@/models/class';
import { User } from '@/models/users';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class VrifyCodeRule implements ValidatorConstraintInterface {
  async validate(value: number, args: ValidationArguments) {
    if (!value) return false;

    const classInfo = await Class.findOne({ where: { code: value } });
    if (classInfo) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return '编号已存在';
  }
}
