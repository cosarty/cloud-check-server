import { ClassType } from '@/types';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  IsInt,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './users';
import uploadConf from '@/config/upload.conf';

@Table({ tableName: 'class', paranoid: true })
export class Class extends Model<Class> implements ClassType {
  @Column
  className: string;

  @PrimaryKey
  @Default(new Date().getTime())
  @Column
  classId: string;

  @BelongsTo(() => User, {
    targetKey: 'userId',
    foreignKey: 'teacherId',
  })
  teacher: User;

  @AllowNull
  @Column
  get remarks(): string {
    return this.getDataValue('remarks') ?? '暂无备注';
  }

  // set remarks(value) {
  //   this.setDataValue('remarks', value + '自定义');
  // }

  @AllowNull
  @Column
  get picture(): string {
    return this.getDataValue('picture')
      ? process.env.HOST +
          uploadConf().base['classAvatarDir'].public +
          '/' +
          this.getDataValue('picture')
      : null;
  }

  @IsInt
  @Column
  code: number;

  teacherId?: string;
}
