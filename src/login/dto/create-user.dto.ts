import { VerifyPasswordRule } from './../../common/rule/verify-password.rule';
import { AuthType, SexType, UserType } from '@/types';
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
} from 'class-validator';

export class CreateUserDto implements UserType {
  @IsDefined({ message: '请输入邮箱' })
  @IsEmail({}, { message: '请输入合法邮箱' })
  email?: string;
  @IsDefined({ message: '请选择身份' })
  @IsIn(['teacher', 'student', 'admin'], { message: '身份错误' })
  auth?: AuthType;
  @IsDefined({ message: '请选择性别' })
  @IsBoolean({ message: '性别错误' })
  sex?: SexType;
  @IsDefined({ message: '请输入密码' })
  @IsString({ message: '密码为字符串类型' })
  @MinLength(9, { message: '密码长度最少9位' })
  @Validate(VerifyPasswordRule)
  password?: string;

  @IsDefined({ message: '请输入用户名' })
  @IsString({ message: '用户名为字符串类型' })
  user_name?: string;

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
}
