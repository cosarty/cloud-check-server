import { User } from '@/common/decorator/user.decorator';
import { Auth, Super } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import { MyException } from '@/util/MyException';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { UserType } from 'types/models';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { deleteClassDto, UpdateClassDto } from './dto/update-class.dto';

@Controller('class')
@Auth()
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    @Inject(ModelsEnum.Class)
    private readonly classModel: PickModelType<ModelsEnum.Class>,
  ) {}
  @Post('create')
  @Super()
  async createClass(@Body() createClass: CreateClassDto) {
    return await this.classService.createClass(createClass);
  }

  /**
   * 更新班级信息的话
   * 辅导员只能更改备注和头像
   * 管理员可以修改 所有信息
   * 超级管理员可以删除班级
   */
  @Post('update')
  @Auth(['admin', 'teacher'])
  async updateClass(@Body() payload: UpdateClassDto, @User() user: UserType) {
    if (!user.isAdmin && !user.super) {
      const res = await this.classModel.findOne({
        where: { teacherId: user.userId, classId: payload.classId },
      });

      if (!res) throw new MyException({ error: '暂无权限', code: '403' });
    }

    return await this.classService.updateClass(
      payload,
      user.userId,
      user.isAdmin,
    );
  }

  @Delete('delete/:classId')
  @Super()
  @HttpCode(203)
  async deleteClass(@Param() payload: deleteClassDto) {
    await this.classModel.destroy({ where: { classId: payload.classId } });
    return { message: '删除成功' };
  }
}
