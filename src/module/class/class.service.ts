import { ModelsEnum, PickModelType } from '@/models';
import { MyException } from '@/util/MyException';
import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  constructor(
    @Inject(ModelsEnum.Class)
    private readonly classModel: PickModelType<ModelsEnum.Class>,
  ) {}
  async createClass(classinfo: CreateClassDto) {
    try {
      const newclass = await this.classModel.create(classinfo, {
        fields: [
          'code',
          'className',
          'picture',
          'teacherId',
          'remarks',
          'departmentId',
        ],
      });
      return { message: '班级创建成功', data: newclass.toJSON() };
    } catch (error) {
      throw new MyException({ error: '班级创建失败', code: '500' });
    }
  }

  // 更新班级
  async updateClass(
    payload: UpdateClassDto,
    userId: string,
    isAdmin: boolean,
    isSuper: boolean,
  ) {
    // 是管理员就更新全部
    const res = await this.classModel.update(
      { remarks: payload.remarks, ...(isAdmin || isSuper ? payload : {}) },
      {
        where: {
          ...(!isAdmin && !isSuper ? { teacherId: userId } : {}),
          classId: payload.classId,
        },
      },
    );
    return { message: '更新成功', data: res };
  }

  async getClassList({
    pageCount,
    pageSize,
    departmentId,
    className,
    teacher,
    createdAt,
  }) {
    return await this.classModel.findAndCountAll({
      order: [['createdAt', createdAt || 'DESC']],
      limit: Number(pageSize),
      offset: Number((pageCount - 1) * pageSize),
      where: {
        ...(departmentId ? { departmentId } : {}),
        ...(className ? { className: { [Op.substring]: className } } : {}),
      },

      include: [
        {
          association: 'teacher',
          ...(teacher
            ? { where: { userName: { [Op.substring]: teacher } } }
            : {}),
        },
        {
          association: 'department',
        },
      ],
    });
  }
}
