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
  @Default(getId())
  @PrimaryKey
  @Column
  statId: string;

  @BelongsTo(() => ClassSchedule, { foreignKey: 'classScheduleId' })
  classSchedule: string;
  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: string;
  @Column
  statTime: Date;
  @Column
  tagetScope: number;
  @Column
  signOutTime: Date;
}
