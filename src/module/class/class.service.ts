import { ModelsEnum, PickModelType } from '@/models';
import { MyException } from '@/util/MyException';
import { Inject, Injectable } from '@nestjs/common';
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
        fields: ['code', 'className', 'picture', 'teacherId', 'remarks'],
      });
      return { message: '班级创建成功', data: newclass.toJSON() };
    } catch (error) {
      throw new MyException({ error: '班级创建失败', code: '500' });
    }
  }

  // 更新班级
  async updateClass(payload: UpdateClassDto, userId: string, isAdmin: boolean) {
    // 是管理员就更新全部
    const res = await this.classModel.update(
      { remarks: payload.remarks, ...(isAdmin ? payload : {}) },
      {
        where: {
          ...(!isAdmin ? { teacherId: userId } : {}),
          classId: payload.classId,
        },
      },
    );
    return { message: '更新成功', data: res };
  }

  async getClassList() {
    return await this.classModel.findAll()
  }
}
