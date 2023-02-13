import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class VerifyPasswordRule implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    /**
     * 至少包含大小写字母 位数至少两位
     */
    const regx =
      // /^\S*(?=\S{9,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/;
      /^\S*(?=\S{9,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])\S*$/;

    return regx.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return '密码至少包含一位小写字母和一位大写字母';
  }
}
