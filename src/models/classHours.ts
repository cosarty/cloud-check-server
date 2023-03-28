import { getId } from '@/util/utils';
import {
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from '@/models/users';
import { ClassSchedule } from './classSchedule';
import { UUIDV4 } from 'sequelize';
import { WeekNum } from '@/constants/weekEnum';
import { Time } from './time';
import { TimingTask } from './timing';
export type SchoolTimeType = Record<keyof typeof WeekNum, string[]>;
// 上课时间的关联表
export interface ClassHoursType {
  classHoursId: string;
  timeId?: number; // 上课的节数
  timingId?: string; // 轮询id
  classScheduleId?: string; // 课程id
  weekDay?: string; //星期几
}

/**
 * 删除 课程的时候
 * 删除 某个上课时间
 * 删除 删除classSchdule的时候 - 完成
 * 删除 timing 的时候
 *
 * 以上情况都要删除
 */

// 签到任务
@Table({ tableName: 'class_hours', timestamps: true, paranoid: true })
export class ClassHours
  extends Model<ClassHoursType>
  implements ClassHoursType
{
  @Default(UUIDV4)
  @PrimaryKey
  @Column
  classHoursId: string;
  @BelongsTo(() => ClassSchedule)
  classSchedule: ClassSchedule;

  @ForeignKey(() => ClassSchedule)
  @Column
  classScheduleId?: string; // 课程id

  @BelongsTo(() => Time, { foreignKey: 'timeId' })
  time: Time;

  timeId?: number; // 上课的节数

  @BelongsTo(() => TimingTask, { foreignKey: 'timingId' })
  timing: TimingTask;

  timingId?: string; // 轮询id

  @Column
  weekDay?: string;
}
