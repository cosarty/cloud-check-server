import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  Default,
  HasMany,
  IsInt,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './users';
import uploadConf from '@/config/upload.conf';
import { Department } from './department';
import { UUIDV4 } from 'sequelize';
import { ClassSchedule } from './classSchedule';
import { Course } from './course';

export type ClassType = {
  className: string;
  classId?: string;
  teacherId?: string;
  remarks?: string;
  picture?: string;
  code: number; // 班级编号
};

@Table({ tableName: 'class', paranoid: true })
// @DefaultScope(() => ({ order: [['createdAt', 'DESC']] }))
export class Class extends Model<Class> implements ClassType {
  @Column
  className: string;

  @PrimaryKey
  @Default(UUIDV4)
  @Column
  classId: string;

  @BelongsTo(() => User, {
    targetKey: 'userId',
    foreignKey: 'teacherId',
  })
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
  get picture(): string {
    return this.getDataValue('picture')
      ? process.env.HOST +
          uploadConf().base['classAvatarDir'].public +
          '/' +
          this.getDataValue('picture')
      : null;
  }

  @IsInt
  @Column
  code: number;

  @BelongsTo(() => Department, {
    targetKey: 'departmentId',
    foreignKey: 'departmentId',
  })
  department: string;

  @BelongsToMany(() => Course, () => ClassSchedule)
  course: Course;
  @HasMany(() => ClassSchedule, { sourceKey: 'classId', foreignKey: 'classId' })
  classSchedule: ClassSchedule[];

  departmentId?: string;

  teacherId?: string;

  // 获取班级学生
  @HasMany(() => User, { sourceKey: 'classId', foreignKey: 'classId' })
  studnets: User[];
}
