import { getId } from '@/util/utils';
import {
  AllowNull,
  Column,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export interface TimeType {
  timeId: string;
  startTime: string;
  endTime: string;
  id: number;
}
@Table({ tableName: 'time', timestamps: true, paranoid: true })
export class Time extends Model<Time> implements TimeType {
  @Default(getId())
  @PrimaryKey
  @Column
  timeId: string;
  @AllowNull
  @Column
  startTime: string;
  @AllowNull
  @Column
  endTime: string;
  @AllowNull
  @Column
  id: number;
}
