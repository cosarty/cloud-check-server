import { ClassType } from '@/types';
import { PartialType } from '@nestjs/mapped-types';
import { Validate } from 'class-validator';
import { VrifyClassRule } from '../rule/verify-class.rule';
import { CreateClassDto } from './create-class.dto';

export class UpdateClassDto
  extends PartialType(CreateClassDto)
  implements Partial<ClassType>
{
  @Validate(VrifyClassRule)
  classId?: string;
}
