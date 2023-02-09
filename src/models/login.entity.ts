import { Column, DeletedAt, Model, Table } from 'sequelize-typescript';

@Table
export class Login extends Model<Login> {
  @Column
  userName: string;
  @Column
  get password(): string {
    console.log('thi', this.getDataValue('password'));

    return this.getDataValue('password') + 'hhhhhhhhhhhdfsafd';
  }
  set password(v) {
    this.setDataValue('password', v);
  }
  @DeletedAt
  deletionDate: Date;
}
