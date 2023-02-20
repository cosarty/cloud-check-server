import { ClassType } from '@/types';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './users';

@Table({ tableName: 'class', paranoid: true })
export class Class extends Model<Class> implements ClassType {
  @Column
  className: string;

  @PrimaryKey
  @Default(new Date().getTime())
  @Column
  classId: string;

  @BelongsTo(() => User, { targetKey: 'userId', foreignKey: 'teacherId' })
  teacher: User;

  @AllowNull
  @Column
  remarks: string;

  @AllowNull
  @Column
  picture: string;
}
