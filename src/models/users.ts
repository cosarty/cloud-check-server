import { UUIDV4 } from 'sequelize';
import {
  Table,
  Model,
  IsEmail,
  AllowNull,
  Column,
  PrimaryKey,
  Default,
  IsUUID,
  DefaultScope,
  HasOne,
  BelongsTo,
  Scopes,
  HasMany,
} from 'sequelize-typescript';
import uploadConf, { UploadConfType } from '@/config/upload.conf';
import { Class } from './class';
import { Department } from './department';
import { StatInfo } from './statInfo';

export type AuthType = 'student' | 'teacher' | 'admin';
export type SexType = 0 | 1;
export type UserType = {
  userId?: string;
  userName?: string;
  email?: string;
  isBan?: boolean;
  auth?: AuthType;
  sex?: SexType;
  password?: string;
  account?: string; // 学号  或者教师号
  device?: string;
  isAdmin?: boolean;
  super?: boolean;
  classId?: string;
  pic?: string;
};

@Table({ tableName: 'user' })
@DefaultScope(() => ({ attributes: { exclude: ['deletedAt'] } }))
@Scopes(() => ({
  hidePassword: { attributes: { exclude: ['password'] } },
}))
export class User extends Model<User> implements UserType {
  @PrimaryKey
  @Default(UUIDV4)
  @IsUUID('4')
  @Column
  userId: string;
  @Column
  userName: string;
  @IsEmail
  @Column
  email: string;
  @Default(false)
  @Column
  isBan: boolean;
  @Column
  auth: AuthType;
  @Column
  sex: SexType;
  @Column
  password: string;
  @AllowNull
  @Column
  account: string;
  @AllowNull
  @Column
  device: string;

  @AllowNull
  @Column
  get classId(): string {
    return this.getDataValue('classId');
  }

  @BelongsTo(() => Class, { targetKey: 'classId', foreignKey: 'classId' })
  class: Class;

  @Default(false)
  @Column
  isAdmin: boolean;

  @AllowNull
  @Column
  super: boolean;

  @AllowNull
  @Column
  get pic(): string {
    return this.getDataValue('pic')
      ? process.env.HOST +
          uploadConf().base['userAvatarDir'].public +
          '/' +
          this.getDataValue('pic')
      : null;
  }

  @BelongsTo(() => Department, {
    targetKey: 'departmentId',
    foreignKey: 'departmentId',
  })
  department: Department;

  departmentId?: string;

  @HasMany(() => Class, {
    sourceKey: 'userId',
    foreignKey: 'teacherId',
  })
  instructor: Class;

  instructorId?: string;

  @AllowNull
  @Column
  face: boolean; // 是否录入人脸

  // 获取签到记录
  @HasMany(() => StatInfo, { foreignKey: 'userId' })
  statInfo: StatInfo;
}
