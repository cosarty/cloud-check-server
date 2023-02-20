import { VrifyIdentity } from '@/common/rule/verify-identity.rule';
import { AuthEnum } from '@/constants/authEnum';
import {
  IsDefined,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';

import { ClassType } from 'types/models';

export class CreateClassDto implements ClassType {
  @IsOptional()
  @IsUUID('4', { message: '教师id错误' })
  @Validate(VrifyIdentity, [AuthEnum.TEACHER])
  teacherId?: string;
  @IsOptional()
  @IsString({ message: '图片为字符串类型' })
  picture?: string;

  @IsDefined({ message: '请输入班级编号' })
  @IsInt({ message: '班级编号为整数' })
  code: number;
  @IsOptional()
  @IsString({ message: '备注为字符串类型' })
  remarks: string;
  @IsDefined({ message: '请输入班级名称' })
  className: string;
}
