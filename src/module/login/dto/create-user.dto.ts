import { VerifyPasswordRule } from '@/common/rule/verify-password.rule';
import { AuthType, SexType, UserType } from '@/models/users';
import {
  IsDefined,
  IsIn,
  ValidateIf,
  ValidationArguments,
  IsEmail,
  IsBoolean,
  IsString,
  Validate,
  MinLength,
  Length,
} from 'class-validator';
import { EmailRegister } from '@/common/rule/email-register.rule';
import { ValidateCaptcha } from '@/common/rule/validate-captcha';
import { PickType } from '@nestjs/mapped-types';
import { IsConfirmedRule } from '@/common/rule/confirmation.rule';

export class CreateUserDto implements UserType {
  @IsDefined({ message: '请输入邮箱' })
  @IsEmail({}, { message: '请输入合法邮箱' })
  @Validate(EmailRegister, ['register'])
  email?: string;
  @IsDefined({ message: '请选择身份' })
  @IsIn(['teacher', 'student'], { message: '身份错误' })
  auth?: AuthType;
  @IsDefined({ message: '请选择性别' })
  @IsIn([0, 1], { message: '性别错误' })
  sex?: SexType;
  @IsDefined({ message: '请输入密码' })
  @IsString({ message: '密码为字符串类型' })
  @MinLength(9, { message: '密码长度最少9位' })
  @Validate(VerifyPasswordRule)
  password?: string;

  @IsDefined({ message: '请输入用户名' })
  @IsString({ message: '用户名为字符串类型' })
  userName?: string;

  @ValidateIf((o: CreateUserDto) => ['student', 'teacher'].includes(o.auth))
  @IsDefined({
    message(args: ValidationArguments) {
      const obj = args.object as CreateUserDto;
      if (obj.auth === 'student') return '请输入学号';
      if (obj.auth === 'teacher') return '请输入教室编号';
    },
  })
  @IsString({ message: '编号为字符串类型' })
  account?: string;

  // @IsString({ message: '验证码是字符串类型' })
  // @Length(6, 6, { message: '验证码的长度为6位' })
  // @Validate(ValidateCaptcha)
  // captcha?: string;
}

export class LoginDto extends PickType(CreateUserDto, ['email', 'password']) {
  @IsDefined({ message: '请输入邮箱' })
  @Validate(EmailRegister, ['login'])
  @IsEmail({}, { message: '请输入合法邮箱' })
  email?: string;

  @IsDefined({ message: '请输入密码' })
  @IsString({ message: '密码为字符串类型' })
  @Validate(IsConfirmedRule)
  password: string;
}
