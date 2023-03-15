import { User } from '@/models/users';
import { MyException } from '@/util/MyException';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class EmailRegister implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    if (!value) return false;
    const user = await User.findOne({ where: { email: value } });
    if (args.constraints[0] === 'register') {
      if (user) throw new MyException({ code: '400', error: '用户已注册' });
      return true;
    }

    if (args.constraints[0] === 'login') {
      if (!user) throw new MyException({ code: '400', error: '用户不存在' });
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return '错误';
  }
}
