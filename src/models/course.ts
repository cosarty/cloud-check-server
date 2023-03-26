import {
  BelongsTo,
  BelongsToMany,
  Column,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './users';
import { getId } from '@/util/utils';
import { UUID, UUIDV4 } from 'sequelize';
import uploadConf from '@/config/upload.conf';
import { Class } from './class';
import { ClassSchedule } from './classSchedule';
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
  @Default(UUIDV4)
  @PrimaryKey
  @Column
  courseId: string;

  @Column
  courseName: string;

  @Column
  get picture(): string {
    return this.getDataValue('picture')
      ? process.env.HOST +
          uploadConf().base['courseAvatarDir'].public +
          '/' +
          this.getDataValue('picture')
      : null;
  }

  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: User;

  userId: string;

  @BelongsToMany(() => Class, () => ClassSchedule)
  course: Course;

  @Column
  comment: string;
}
