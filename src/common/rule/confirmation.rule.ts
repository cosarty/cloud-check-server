import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as argon2 from 'argon2';
import { User } from '@/models/users';
import { LoginDto } from '@/module/login/dto/create-user.dto';
@ValidatorConstraint()
export class IsConfirmedRule implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    const email = (args.object as LoginDto).email;
    if (!email) return false;
    const user = (await User.findOne({ where: { email } })) ?? ({} as any);
    if (!user.password) return false;
    const isPass = await argon2.verify(user.password, value);

    return isPass;
    // return value === args.object[`${args.property}_confirmation`];
  }

  defaultMessage(args: ValidationArguments) {
    return '密码错误';
  }
}
