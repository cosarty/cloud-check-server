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
import * as argon2 from 'argon2';
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
  get password(): string {
    return this.getDataValue('password');
  }
  // 密码加密
  set password(paasword: string) {
    this.setDataValue('password', this.password);
  }
  @AllowNull
  @Column
  account: string;
  @AllowNull
  @Column
  device: string;

  @Default(false)
  @Column
  isAdmin: boolean;

  @AllowNull
  @Column
  super: boolean;
}
