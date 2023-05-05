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
  Query,
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
import { Op, Sequelize, where } from 'sequelize';
import { ClassscheduleService } from '../classSchedule/classschedule.service';
import * as loadsh from 'lodash';

@Controller('class')
@Auth()
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    @Inject(ModelsEnum.Class)
    private readonly classModel: PickModelType<ModelsEnum.Class>,
    @Inject(ModelsEnum.User)
    private readonly user: PickModelType<ModelsEnum.User>,
    @Inject(ModelsEnum.StatInfo)
    private readonly statInfo: PickModelType<ModelsEnum.StatInfo>,
    @Inject(ModelsEnum.SingTask)
    private readonly singTask: PickModelType<ModelsEnum.SingTask>,
    @Inject(ModelsEnum.ClassSchedule)
    private readonly classSchedule: PickModelType<ModelsEnum.ClassSchedule>,
    private readonly classSchduelServe: ClassscheduleService,
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
      user.super,
    );
  }

  @Delete('delete/:classId')
  @Super()
  @HttpCode(203)
  async deleteClass(@Param() payload: deleteClassDto) {
    const chedule = await this.classSchedule.findAll({
      where: {
        classId: payload.classId,
      },
    });

    // 删除classSchdule
    for (const ch of chedule) {
      await this.classSchduelServe.deleteSchedule(ch.classScheduleId);
    }
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
      include: ['teacher'],
    });
    // 只有管理员,班级的学生
    return classInfo.toJSON();
  }

  @Get('/getUsers/:classId')
  async getUsers(@Param() payload: any, @Query() pram: any) {
    const users = await this.user.scope('hidePassword').findAndCountAll({
      where: {
        classId: payload.classId,
        ...(pram.account ? { account: { [Op.substring]: pram.account } } : {}),
        ...(pram.userName
          ? { userName: { [Op.substring]: pram.userName } }
          : {}),
      },
      include: [
        {
          association: 'statInfo',
          include: [{ association: 'singTask' }],
        },
      ],
      attributes: {
        exclude: ['classId', 'super', 'isAdmin', 'isBan'],
      },
      ...(pram.pageSize ? { limit: Number(pram.pageSize) } : {}),
      ...(pram.pageCount
        ? { offset: Number((pram.pageCount - 1) * pram.pageSize) }
        : {}),
    });
    return users;
  }

  // 删除学生到班级
  @Delete('/delUsers')
  async delUsers(@Body() payload: DelUserToClassDto) {
    let { classId, userId } = payload;
    userId = Array.isArray(userId) ? userId : [userId];
    await this.user.update({ classId: null }, { where: { userId, classId } });
    return { message: '删除成功' };
  }

  /** @description 获取班级列表 */
  @Get('getList')
  @Auth()
  async getClassList(@Query() pram: any) {
    const data = await this.classService.getClassList(pram);
    return data;
  }

  // 获取课程班级统计
  @Get('getClassStat/:classId')
  async getSchduleStudents(
    @Param() { classId }: any,
    @Query() { userId }: any,
  ) {
    // console.log('classId: ', classId);
    // console.log('userId: ', userId);

    const sc = await this.user.count({
      where: {
        classId,
      },
    });

    const info = await this.classSchedule.findAll({
      where: {
        classId,
        isEnd: false,
      },
      include: [
        {
          association: 'course',
        },
        {
          association: 'singTask',
          include: [
            {
              association: 'students',
              required: false,
              where: {
                ...(userId ? { userId } : {}),
              },
            },
          ],
        },
      ],
    });

    const cpi = info.map((i) => {
      return i.singTask.reduce(
        (pre: any, nxt) => {
          if (userId) {
            if (
              nxt.students?.[0]?.type !== undefined &&
              pre.students?.[0]?.type !== null
            ) {
              pre[nxt.students[0]?.type ?? 0] += 1;
            } else {
              pre[2] += 1;
            }
          } else {
            pre[2] +=
              sc -
              nxt.students.filter(
                (s) => s.type !== undefined && s.type !== null,
              ).length;
            pre[0] += sc - nxt.students.filter((s) => s.type === 0).length;
            pre[1] += sc - nxt.students.filter((s) => s.type === 1).length;
          }

          return pre;
        },
        [0, 0, 0],
      );
    });

    return {
      value: loadsh.zip(...cpi),
      name: info.map((i) => i.course.courseName),
    };
  }

  // 获取我管理的班级
  @Get('getInstructor')
  @Auth()
  async getInstructor(@User() user) {
    return await this.classModel.findAll({
      where: {
        teacherId: user.userId,
      },
      include: [{ association: 'teacher' }],
    });
  }

  @Get('getTeacherCourse')
  async getTeacherCourse(@Query() { classId, userId }: any) {
    console.log('classId,userId: ', classId, userId);
    const sc = await this.user.count({
      where: {
        classId,
      },
    });

    const info = await this.classSchedule.findAll({
      where: {
        classId,
        isEnd: false,
      },
      include: [
        {
          association: 'course',
          where: {
            userId,
          },
        },
        {
          association: 'singTask',
          include: [
            {
              association: 'students',
              required: false,
            },
          ],
        },
      ],
    });

    const cpi = info.map((i) => {
      return i.singTask.reduce(
        (pre: any, nxt) => {
          pre[2] +=
            sc -
            nxt.students.filter((s) => s.type !== undefined && s.type !== null)
              .length;
          pre[0] += sc - nxt.students.filter((s) => s.type === 0).length;
          pre[1] += sc - nxt.students.filter((s) => s.type === 1).length;

          return pre;
        },
        [0, 0, 0],
      );
    });

    return {
      value: loadsh.zip(...cpi),
      name: info.map((i) => i.course.courseName),
    };
  }
}
