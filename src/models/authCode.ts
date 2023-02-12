import { AuthCodeType } from 'types';
import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'auth_code' })
export class AuthCode extends Model<AuthCode> implements AuthCodeType {
  @Column
  expireTime: Date; //过期时间
  @Column
  email: string;
  @Column
  captcha: string;
  @Column
  work: boolean;
}
