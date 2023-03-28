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
import { TimingTask } from './timing';

export interface SingTaskType {
  singTaskId: string;
  classScheduleId?: string;
  taskName: string;
  location: string; // 位置
  areaId: string; //位置id,
  singTime: Date; // 签到时间
  sustain: number; // 持续时间
  userId?: string;
  integral: number; // 签到分数
}

// 签到任务
@Table({ tableName: 'sing_task', timestamps: true, paranoid: true })
export class SingTask extends Model<SingTask> implements SingTaskType {
  @Default(UUIDV4)
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
  sustain: number;
  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: User;
  @Column
  integral: number;
  @Column
  scheduleName: string; //定时任务名字

  @Column
  period: string; // 时间规则

  // 轮询id 用来判断这次的签到是单次的还是轮询推送的
  @BelongsTo(() => TimingTask, { foreignKey: 'timingId' })
  timing;

  @Default(false)
  @Column
  isEnd: boolean;

  timingId: string;
}
