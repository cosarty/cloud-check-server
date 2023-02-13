import { AuthCodeType } from 'types';
import { Column, Default, Model, Table } from 'sequelize-typescript';
import * as dayjs from 'dayjs';
@Table({ tableName: 'auth_code' })
export class AuthCode extends Model<AuthCode> implements AuthCodeType {
  @Default(dayjs().add(1, 'minute').toDate())
  @Column
  expireTime: Date; //过期时间
  @Column
  email: string;
  @Column
  captcha: string;
  @Default(false)
  @Column
  work: boolean;
}
