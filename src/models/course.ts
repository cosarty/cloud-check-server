import {
  BelongsTo,
  Column,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './users';
import { getId } from '@/util/utils';
export interface CourseType {
  courseId: string;
  courseName: string;
  picture: string;
  //   userId: string; // 课程创建者
  comment: string; // 注释信息
}

@Table({
  tableName: 'course',
  timestamps: true,
  paranoid: true,
})
export class Course extends Model<Course> implements CourseType {
  @Default(getId())
  @PrimaryKey
  @Column
  courseId: string;

  @Column
  courseName: string;

  @Column
  picture: string;

  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: string;
  @Column
  comment: string;
}
