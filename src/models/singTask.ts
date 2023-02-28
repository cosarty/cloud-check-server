import { getId } from '@/util/utils';
import {
  BelongsTo,
  Column,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'types/models';
import { ClassSchedule } from './classSchedule';

export interface SingTaskType {
  singTaskId: string;
  classScheduleId?: string;
  taskName: string;
  taskTime: Date;
  location: string; // 位置
  areaId: string; //位置id,
  singTime: Date; // 签到时间
  outTime: Date; // 签退时间
  sustain: number; // 持续时间
  userId?: string;
  integral: number; // 签到分数
  assign: string; //  指派人
  period: string; // 周期  月m 日d 周w  定时任务周期
  isPeriod: Boolean; // 是否开启定时任务
}

// 签到任务
@Table({ tableName: 'sing_task', timestamps: true, paranoid: true })
export class SingTask extends Model<SingTask> implements SingTaskType {
  @Default(getId())
  @PrimaryKey
  @Column
  singTaskId: string;
  @BelongsTo(() => ClassSchedule, { foreignKey: 'classScheduleId' })
  classSchedule: ClassSchedule;
  @Column
  taskName: string;
  @Column
  taskTime: Date;
  @Column
  location: string;
  @Column
  areaId: string;
  @Column
  singTime: Date;
  @Column
  outTime: Date;
  @Column
  sustain: number;
  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: User;
  @Column
  integral: number;
  @Column
  assign: string;
  @Column
  period: string;
  @Column
  isPeriod: Boolean;
}
