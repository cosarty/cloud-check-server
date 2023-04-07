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
import { Class } from './class';
import { Department } from './department';

export interface SingTaskType {
  singTaskId: string;
  classScheduleId?: string;
  taskName: string; // 签到时间
  location: string; // 位置
  areaId: string; //位置id,
  sustain: number; // 签到分数
  userId?: string;
  integral: number; // 签到时间 按秒记录
  distance: number; // 签到距离
  locationName?:string // 地址
}
// 签到任务可以分为  班级 课程 和系别

// 签到任务
@Table({ tableName: 'sing_task', timestamps: true, paranoid: true })
export class SingTask extends Model<SingTask> implements SingTaskType {
  @Default(UUIDV4)
  @PrimaryKey
  @Column
  singTaskId: string;
  @BelongsTo(() => ClassSchedule, { foreignKey: 'classScheduleId' })
  classSchedule: ClassSchedule;

  classScheduleId: string;
  @Column
  taskName: string;
  @Column
  taskTime: Date;
  @Column
  location: string;
  @Column
  locationName: string;
  @Column
  areaId: string;

  @Default(1)
  @Column
  sustain: number;
  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: User;
  @Column
  integral: number;
  @Column
  scheduleName: string; //定时任务名字



  // 轮询id 用来判断这次的签到是单次的还是轮询推送的
  @BelongsTo(() => TimingTask, { foreignKey: 'timingId' })
  timing: TimingTask;

  @Default(false)
  @Column
  isEnd: boolean;

  timingId: string;

  @Column
  distance: number;


  @Default(false)
  @Column
  isFace: boolean; // 是否开启人脸
}
