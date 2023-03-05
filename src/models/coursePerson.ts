import { getId } from '@/util/utils';
import {
  BelongsTo,
  Column,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from '@/models/users';
import { ClassSchedule } from './classSchedule';

export interface CoursePersonType {
  coursePersonId?: string;
  userId?: string;
  classScheduleId?: string;
  count: number; // 签到次数
  integral: string; // 分数
}

@Table({ tableName: 'course_person', timestamps: true, paranoid: true })
export class CoursePerson
  extends Model<CoursePerson>
  implements CoursePersonType
{
  @Default(getId())
  @PrimaryKey
  @Column
  coursePersonId: string;

  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: string;
  @BelongsTo(() => ClassSchedule, { foreignKey: 'classScheduleId' })
  classSchedule: string;
  @Column
  count: number;
  @Column
  integral: string;
}
