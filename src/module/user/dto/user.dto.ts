import { IsConfirmedRule } from '@/common/rule/confirmation.rule';
import { EmailRegister } from '@/common/rule/email-register.rule';
import { VerifyPasswordRule } from '@/common/rule/verify-password.rule';
import {
  IsDefined,
  IsEmail,
  IsString,
  MinLength,
  Validate,
  ValidateIf,
} from 'class-validator';

export class UpdatePasswordDto {
  @IsDefined({ message: '请输入密码' })
  @IsString({ message: '密码为字符串类型' })
  @MinLength(9, { message: '密码长度最少9位' })
  @Validate(VerifyPasswordRule)
  newPassword: string;

  @IsDefined({ message: '请输入确认密码' })
  @Validate(IsConfirmedRule)
  oldPassword: string;

  @IsDefined({ message: '请输入邮箱' })
  @IsEmail({}, { message: '请输入合法邮箱' })
  @Validate(EmailRegister, ['login'])
  email?: string;
}
