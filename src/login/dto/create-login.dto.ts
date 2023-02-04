import { IsConfirmedRule } from '@/common/rule/confirmation.rule';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Validate, ValidateIf } from 'class-validator';

export class CreateLoginDto {
  @IsNotEmpty()
  name: string;
  //存在price时才验证
  @ValidateIf((o) => o.price)
  //将类型转换为数值
  // @Type(() => Number)
  @IsNumber(null, { message: '请输入数字' })
  price: number;

  @Validate(IsConfirmedRule, { message: '两次密码不一致' })
  // @IsConfirmedRule({ message: '两次密码不一致' })
  password: string;
}
