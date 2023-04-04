import {
  BelongsTo,
  Column,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from '@/models/users';
import { UUIDV4 } from 'sequelize';

export interface AreaType {
  areaId: string;
  areaName: string;
  location: string;
  userId?: string;
  locationName?: string;
}
@Table({ tableName: 'area', timestamps: true, paranoid: true })
export class Area extends Model<Area> implements AreaType {
  @Default(UUIDV4)
  @PrimaryKey
  @Column
  areaId: string;
  @Column
  areaName: string;
  @Column
  location: string;
  @Column
  locationName: string;
  @BelongsTo(() => User, { foreignKey: 'userId' })
  user?: string;
  userId: string;
}
