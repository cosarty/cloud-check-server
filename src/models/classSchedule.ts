import { WeekNum } from '@/constants/weekEnum';
import { getId } from '@/util/utils';
import { UUIDV4 } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Class } from './class';
import { ClassHours } from './classHours';
import { Course } from './course';
import { SingTask } from './singTask';

export interface ClassScheduleType {
  classScheduleId: string;
  classId?: string;
  courseId?: string;
  starDate: Date;
  endDate: Date; // 持续几周
  schooltime?: string;
}

// export class SchoolTime implements Record<keyof typeof WeekNum, string[]> {
//   'monday' = [];
//   'tuesday' = [];
//   'wednesday' = [];
//   'thursday' = [];
//   'friday' = [];
//   'saturday' = [];
//   'sunday' = [];
// }

// export type SchoolTimeType = Record<keyof typeof WeekNum, string[]>;

@Table({ tableName: 'class_schedule', timestamps: true, paranoid: true })
export class ClassSchedule
  extends Model<ClassSchedule>
  implements ClassScheduleType
{
  @Default(UUIDV4)
  @PrimaryKey
  @Column
  classScheduleId: string;

  // @BelongsTo(() => Class)
  // class: string;
  // @BelongsTo(() => Course)
  // course: string;

  @ForeignKey(() => Class)
  @Column
  classId: string;

  @ForeignKey(() => Course)
  @Column
  courseId: string;

  @Column
  starDate: Date;

  @Column
  endDate: Date;

  // 课程是否结束
  @Default(false)
  @AllowNull
  @Column
  isEnd: boolean;

  @HasMany(() => ClassHours)
  classHours: ClassHours;

  @BelongsTo(() => Course, { foreignKey: 'courseId' })
  course: Course;

  @BelongsTo(() => Class, { foreignKey: 'classId' })
  class: Class;

  @HasMany(() => SingTask, {sourceKey:'classScheduleId', foreignKey: 'classScheduleId' })
  singTask: SingTask[];
}
