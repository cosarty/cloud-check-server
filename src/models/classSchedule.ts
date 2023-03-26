import { WeekNum } from '@/constants/weekEnum';
import { getId } from '@/util/utils';
import {
  BelongsTo,
  Column,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Class } from './class';
import { Course } from './course';

export interface ClassScheduleType {
  classScheduleId: string;
  classId?: string;
  courseId?: string;
  starDate: Date;
  endDate: Date; // 持续几周
  schooltime: string;
}

export class SchoolTime implements Record<keyof typeof WeekNum, string[]> {
  'monday' = [];
  'tuesday' = [];
  'wednesday' = [];
  'thursday' = [];
  'friday' = [];
  'saturday' = [];
  'sunday' = [];
}

export type SchoolTimeType = Record<keyof typeof WeekNum, string[]>;

@Table({ tableName: 'class_schedule', timestamps: true, paranoid: true })
export class ClassSchedule
  extends Model<ClassSchedule>
  implements ClassScheduleType
{
  @Default(getId())
  @PrimaryKey
  @Column
  classScheduleId: string;

  @BelongsTo(() => Class, { foreignKey: 'classId' })
  class: string;
  @BelongsTo(() => Course, { foreignKey: 'courseId' })
  course: string;
  classId: string;
  courseId: string;
  @Column
  starDate: Date;

  @Column
  endDate: Date;

  @Column
  schooltime: string;
}
