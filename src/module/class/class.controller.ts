/* eslint-disable prefer-const */
import { User } from '@/common/decorator/user.decorator';
import { Auth, Super } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import { MyException } from '@/util/MyException';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { UserType } from '@/models/users';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import {
  AddUserToClassDto,
  deleteClassDto,
  DelUserToClassDto,
  GetClassDto,
  UpdateClassDto,
} from './dto/update-class.dto';

/**
 * // TODO 统计班级签到信息
 */

@Controller('class')
@Auth()
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    @Inject(ModelsEnum.Class)
    private readonly classModel: PickModelType<ModelsEnum.Class>,
    @Inject(ModelsEnum.User)
    private readonly user: PickModelType<ModelsEnum.User>,
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
    await this.user.update(
      { classId: null },
      { where: { classId: payload.classId } },
    );
    await this.classModel.destroy({
      where: { classId: payload.classId },
    });
    return { message: '删除成功' };
  }

  // 添加用户
  @Post('addUser')
  @HttpCode(203)
  async addUserToClass(@Body() payLoad: AddUserToClassDto) {
    // eslint-disable-next-line prefer-const
    let { classId, userId } = payLoad;

    userId = Array.isArray(userId) ? userId : [userId];
    await this.user.update({ classId }, { where: { userId } });
    return { message: '添加成功' };
  }

  @Get('/get/:classId')
  async getClass(@Param() payload: GetClassDto) {
    const classInfo = await this.classModel.findOne({
      where: { classId: payload.classId },
    });
    // 只有管理员,班级的学生
    return { message: '获取成功', data: classInfo.toJSON() };
  }

  @Get('/getUsers/:classId')
  async getUsers(@Param() payload: GetClassDto) {
    const users = await this.user.scope('hidePassword').findAll({
      where: { classId: payload.classId },
      attributes: {
        exclude: ['classId', 'super', 'isAdmin', 'isBan'],
      },
    });
    return { message: '获取成功', data: users.map((s) => s.toJSON()) };
  }

  // 删除学生到班级
  @Delete('/delUsers')
  async delUsers(@Body() payload: DelUserToClassDto) {
    let { classId, userId } = payload;
    userId = Array.isArray(userId) ? userId : [userId];
    await this.user.update({ classId: null }, { where: { userId, classId } });
    return { message: '删除成功' };
  }
}
