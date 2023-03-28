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
import { UUIDV4 } from 'sequelize';

export interface TimingType {
  timingId: string;
  classScheduleId?: string;
  taskName: string;
  location: string; // 位置
  areaId: string; //位置id,
  sustain: number; // 持续时间
  userId?: string;
  integral: number; // 签到分数
  period: string; // 周期  月m 日d 周w  定时任务周期
}

// 签到任务
@Table({ tableName: 'timing_task', timestamps: true, paranoid: true })
export class TimingTask extends Model<TimingTask> implements TimingType {
  @Default(UUIDV4)
  @PrimaryKey
  @Column
  timingId: string;
  @BelongsTo(() => ClassSchedule, { foreignKey: 'classScheduleId' })
  classSchedule: ClassSchedule;
  classScheduleId: string;
  @Column
  taskName: string;
  @Column
  location: string;
  @Column
  areaId: string;
  @Column
  sustain: number;
  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: User;
  userId: string;
  @Column
  integral: number;

  @Column
  period: string;

  @Column
  scheduleName: string; //定时任务名字
}
