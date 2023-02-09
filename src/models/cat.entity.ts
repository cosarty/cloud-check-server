import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Cat extends Model<Cat> {
  @Column
  kind: string;
  @Column
  name: string;
}
