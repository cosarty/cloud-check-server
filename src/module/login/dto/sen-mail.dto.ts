import { EmailTypeEnum } from 'types/conf/enum';
import { PickType } from '@nestjs/mapped-types';
import { IsDefined, IsEmail, IsIn, Validate } from 'class-validator';

import { CreateUserDto } from './create-user.dto';
import { EmailTypeRule } from '@/common/rule/email-type.rule';
import { EmailRegister } from '@/common/rule/email-register.rule';

export class SendMailDto extends PickType(CreateUserDto, ['email']) {

  @IsDefined({ message: '请输入邮箱' })
  @IsEmail({}, { message: '请输入合法邮箱' })
  @Validate(EmailRegister)
  email?: string;

  @IsIn([...Object.values(EmailTypeEnum)], { message: '邮件类型错误' })
  @Validate(EmailTypeRule)
  type: `${EmailTypeEnum}`;
}
