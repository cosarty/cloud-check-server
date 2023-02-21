import { RoleType } from '@/constants/authEnum';
import { Class } from '@/models/class';
import { User } from '@/models/users';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class VrifyClassRule implements ValidatorConstraintInterface {
  async validate(value: number, args: ValidationArguments) {
    if (!value) return false;

    const classInfo = await Class.findOne({
      where: { classId: value },
    });
    return !!classInfo;
  }
  defaultMessage(args: ValidationArguments) {
    return '不存在此教室';
  }
}
