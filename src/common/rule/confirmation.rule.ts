import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsConfirmedRule implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    return value === args.object[`${args.property}_confirmation`];
  }

  defaultMessage(args: ValidationArguments) {
    return '数据不匹配';
  }
}
