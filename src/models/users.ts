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
} from 'sequelize-typescript';
import { AuthType, SexType, UserType } from 'types';
import uploadConf, { UploadConfType } from '@/config/upload.conf';
@Table({ tableName: 'user' })
@DefaultScope(() => ({ attributes: { exclude: ['deletedAt'] } }))
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
}
