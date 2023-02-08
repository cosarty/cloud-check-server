import { IsConfirmedRule } from '@/common/rule/confirmation.rule';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  Length,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';

class Test {
  @IsNotEmpty({ message: 'abc不能为空' })
  abc: string;
}

class User {
  @IsNotEmpty({ message: '学号不能为空' })
  @MinLength(10, { message: '学号的长度最少10' })
  stu: string;
  @IsInt({ message: '年龄必须是整数' })
  age: number;

  @Type(() => Test)
  @ValidateNested()
  test: Test;
}

export class CreateLoginDto {
  @Length(3, 6, {
    message(args: ValidationArguments) {
      // console.log('args: ', args);

      return '长度不能小于10大于20';
    },
  })
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string;
  //存在price时才验证
  @ValidateIf((o) => o.price)
  //将类型转换为数值
  // @Type(() => Number)
  @IsInt({ message: '请输入数字' })
  price: number;

  @Validate(IsConfirmedRule, { message: '两次密码不一致' })
  // @IsConfirmedRule({ message: '两次密码不一致' })
  password: string;

  @MaxLength(3, { message: '标签数最大为$constraint1', each: true })
  @IsArray({ message: 'tags是一个数组' })
  tags: string[];

  @Type(() => User)
  @ValidateNested()
  user: User;
}
