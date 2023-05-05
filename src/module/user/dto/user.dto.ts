import { IsConfirmedRule } from '@/common/rule/confirmation.rule';
import { EmailRegister } from '@/common/rule/email-register.rule';
import { ValidateCaptcha } from '@/common/rule/validate-captcha';
import { VerifyPasswordRule } from '@/common/rule/verify-password.rule';
import { AddUserToClassDto } from '@/module/class/dto/update-class.dto';
import { PickType } from '@nestjs/mapped-types';
import {
  IsDefined,
  IsEmail,
  IsString,
  Length,
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

  @IsDefined({ message: '请输入邮箱' })
  @IsEmail({}, { message: '请输入合法邮箱' })
  @Validate(EmailRegister, ['login'])
  email: string;

  @IsDefined({ message: '请输入确认密码' })
  @Validate(IsConfirmedRule)
  oldPassword: string;

  @IsDefined({ message: '请输入验证码' })
  capacha: string;
}

export class BindUserDto extends PickType(AddUserToClassDto, ['userId']) {}

export class UpdateEmailDto {
  @IsDefined({ message: '请输入邮箱' })
  @IsEmail({}, { message: '请输入合法邮箱' })
  @Validate(EmailRegister, ['register'])
  email?: string;

  @IsString({ message: '验证码是字符串类型' })
  @Length(6, 6, { message: '验证码的长度为6位' })
  @Validate(ValidateCaptcha)
  captcha?: string;
}

export class ForgetPassword {
  @IsDefined({ message: '请输入密码' })
  @IsString({ message: '密码为字符串类型' })
  @MinLength(9, { message: '密码长度最少9位' })
  @Validate(VerifyPasswordRule)
  password: string;
  

  @IsString({ message: '验证码是字符串类型' })
  @Length(6, 6, { message: '验证码的长度为6位' })
  @Validate(ValidateCaptcha)
  captcha?: string;

  @IsDefined({ message: '请输入邮箱' })
  @IsEmail({}, { message: '请输入合法邮箱' })
  @Validate(EmailRegister, ['login'])
  email: string;
}
