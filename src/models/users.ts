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
@Table({ tableName: 'user' })
export class User extends Model<User> implements UserType {
  @PrimaryKey
  @Default(UUIDV4)
  @IsUUID('4')
  @Column
  user_id: string;
  @Column
  user_name: string;
  @IsEmail
  @Column
  emial: string;
  @Column
  is_ban: boolean;
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
}
