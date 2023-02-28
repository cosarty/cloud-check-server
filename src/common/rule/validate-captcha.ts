import { SendMailDto } from '@/module/login/dto/sen-mail.dto';
import { UserType } from '@/models/users';
import { EmailTypeEnum } from 'types';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Op } from 'sequelize';

import { AuthCode } from 'src/models/authCode';

@ValidatorConstraint()
export class ValidateCaptcha implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    const email = (args.object as UserType).email;
    if (!email) return;
    const aut = await AuthCode.findOne({
      order: [['createdAt', 'DESC']],
      where: {
        email,
        expireTime: { [Op.gt]: new Date() },
      },
    });
    if (!aut) return false;
    return aut.toJSON().captcha === value;
  }

  defaultMessage(args: ValidationArguments) {
    return '验证码错误';
  }
}
