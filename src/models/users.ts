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
} from 'sequelize-typescript';
import { AuthType, SexType, UserType } from 'types';
import argon2 from 'argon2';
@Table({ tableName: 'user' })
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
    argon2.hash(paasword, { type: argon2.argon2d }).then((hash) => {
      this.setDataValue('password', hash);
    });
  }
  @AllowNull
  @Column
  account: string;
  @AllowNull
  @Column
  device: string;

  @Column
  isAdmin: boolean;

  @Column
  super: boolean;
}
