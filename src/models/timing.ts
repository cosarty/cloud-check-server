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
  distance: number; // 签到距离
  isFace: boolean; // 是否开启人脸
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
  locationName: string;
  @Column
  areaId: string;

  @Column
  distance: number;
  @Column
  sustain: number;
  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: User;
  userId: string;
  @Default(60)
  @Column
  get integral(): number {
    return this.getDataValue('integral') ?? 60;
  }

  @Column
  period: string; // 时间段默认是上课时间   2022年6月21号-2022年8月31号

  @Default(true)
  @Column
  isPeriod: boolean; // 是否开启轮询

  @Column
  scheduleName: string; //定时任务名字

  @Default(false)
  @Column
  isEnd: boolean;

  @Default(false)
  @Column
  isFace: boolean;
}
