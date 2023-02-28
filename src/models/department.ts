import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './users';
export type DepartmentType = {
  departmentId: string;
  departmentName: string;
  userId: string;
};
@Table({ tableName: 'department' })
export class Department
  extends Model<DepartmentType>
  implements DepartmentType
{
  @PrimaryKey
  @Default(Math.floor(new Date().getTime() + Math.random() * 9 * 10000))
  @Column
  departmentId: string;

  @Column
  departmentName: string;

  @AllowNull
  @ForeignKey(() => User)
  @Column
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
