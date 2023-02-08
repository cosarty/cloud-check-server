import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Login extends Model<Login> {
  @Column
  userName: string;
  @Column
  password: string;
}
