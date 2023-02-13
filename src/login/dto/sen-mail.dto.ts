import { EmailTypeEnum } from 'types/conf/enum';
import { PickType } from '@nestjs/mapped-types';
import { IsIn, Validate } from 'class-validator';

import { CreateUserDto } from './create-user.dto';
import { EmailTypeRule } from '@/common/rule/email-type.rule';

export class SendMailDto extends PickType(CreateUserDto, ['email']) {
  @IsIn([...Object.values(EmailTypeEnum)], { message: '邮件类型错误' })
  @Validate(EmailTypeRule)
  type: `${EmailTypeEnum}`;
}
