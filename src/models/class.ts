import { ClassType } from '@/types';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  IsInt,
  Model,
  PrimaryKey,
  Table,
  Unique,
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
  get remarks(): string {
    return this.getDataValue('remarks') ?? '暂无备注';
  }

  // set remarks(value) {
  //   this.setDataValue('remarks', value + '自定义');
  // }

  @AllowNull
  @Column
  picture: string;

  @IsInt
  @Unique
  @Column
  code: number;

  teacherId?: string;
}
