import { SendMailDto } from '@/module/login/dto/sen-mail.dto';
import { EmailTypeEnum } from '@/types';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { AuthCode } from 'src/models/authCode';

@ValidatorConstraint()
export class EmailTypeRule implements ValidatorConstraintInterface {
  async validate(value: `${EmailTypeEnum}`, args: ValidationArguments) {
    const email = (args.object as SendMailDto).email;
    /**
     * 邮件类型限制 如果不合格的类型直接禁止发送
     *  register  如果用户已经注册成功 就禁止发送注册邮件
     */

    switch (value) {
      case 'register':
        const code = await AuthCode.findOne({
          where: {
            work: true,
            email,
          },
        });

        // 查询数据
        return !code;
      case 'login':
        return true
      default:
        return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return '发送失败';
  }
}
