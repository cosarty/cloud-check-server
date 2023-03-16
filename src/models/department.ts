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
import { getId } from '@/util/utils';
import { UUIDV4 } from 'sequelize';
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
  @Default(UUIDV4)
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
