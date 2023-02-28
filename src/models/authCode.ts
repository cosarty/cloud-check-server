import { Column, Default, Model, Table } from 'sequelize-typescript';
import * as dayjs from 'dayjs';
export type AuthCodeType = {
  expireTime: Date; // 过期时间
  email: string;
  captcha: string; // 验证码
  work: boolean; //是否生效
};

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
