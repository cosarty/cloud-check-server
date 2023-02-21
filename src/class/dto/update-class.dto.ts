import { VrifyIdentity } from '@/common/rule/verify-identity.rule';
import { ClassType } from '@/types';
import { PartialType } from '@nestjs/mapped-types';
import { IsDefined, isDefined, IsUUID, Validate } from 'class-validator';
import { VrifyClassRule } from '../rule/verify-class.rule';
import { CreateClassDto } from './create-class.dto';

export class UpdateClassDto
  extends PartialType(CreateClassDto)
  implements Partial<ClassType>
{
  @Validate(VrifyClassRule)
  classId?: string;
}

// 添加学生到班级
// 更新学生信息
// 上传图片
export class deleteClassDto implements Partial<ClassType> {
  @IsDefined()
  @Validate(VrifyClassRule)
  classId?: string;
}

export class addUserToClassDto {
  @IsDefined()
  @Validate(VrifyClassRule)
  classId?: string;

  @IsDefined({ message: '请选择学生id' })
  @IsUUID('4', { message: '用户id错误', each: true })
  @Validate(VrifyIdentity, ['student'], { message: '不存在此学生' })
  userId: string | string[];
}
