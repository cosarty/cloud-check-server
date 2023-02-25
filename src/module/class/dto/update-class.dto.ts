import { VrifyIdentity } from '@/common/rule/verify-identity.rule';
import { ClassType } from '@/types';
import { PartialType, PickType } from '@nestjs/mapped-types';
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

export class deleteClassDto implements Partial<ClassType> {
  @IsDefined()
  @Validate(VrifyClassRule)
  classId?: string;
}

export class AddUserToClassDto {
  @IsDefined()
  @Validate(VrifyClassRule)
  classId?: string;

  @IsDefined({ message: '请选择学生id' })
  @IsUUID('4', { message: '用户id错误', each: true })
  @Validate(VrifyIdentity, ['student'], { message: '不存在此学生' })
  userId: string | string[];
}

export class GetClassDto {
  @Validate(VrifyClassRule)
  classId: string;
}

export class DelUserToClassDto extends PickType(AddUserToClassDto, [
  'classId',
  'userId',
]) {}
