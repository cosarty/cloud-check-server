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
} from 'sequelize-typescript';
import { AuthType, SexType, UserType } from 'types';
import uploadConf, { UploadConfType } from '@/config/upload.conf';
import { Class } from './class';
import { Department } from './department';
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
    return this.getDataValue('classId') ?? '未加入班级';
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
  department: string;
}
