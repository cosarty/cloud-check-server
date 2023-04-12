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
import { SingTask } from './singTask';
import { UUIDV4 } from 'sequelize';

export interface StatInfoType {
  statId: string;
  classScheduleId?: string;
  userId?: string;
  statTime: Date;
  tagetScope: number; // 签到距离
  signOutTime: Date; //签退时间
}
@Table({ tableName: 'stat_info', timestamps: true, paranoid: true })
export class StatInfo extends Model<StatInfo> implements StatInfoType {
  @Default(UUIDV4)
  @PrimaryKey
  @Column
  statId: string;

  @BelongsTo(() => ClassSchedule, { foreignKey: 'classScheduleId' })
  classSchedule: string;
  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: string;

  userId: string;
  @Column
  statTime: Date;
  @Column
  tagetScope: number;
  @Column
  signOutTime: Date;
  @Column
  sustain: number; // 分数

  @Column
  location: string; // 签到的经纬度

  @Column
  locationName: string; // 签到地点的名字

  // 签到id
  @BelongsTo(() => SingTask, { foreignKey: 'singTaskId' })
  singTask: string;

  singTaskId:string
}
