import { User } from '@/common/decorator/user.decorator';
import { Auth } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClassscheduleService } from './classschedule.service';
import { Op } from 'sequelize';

@Controller('classSchedule')
export class ClassScheduleController {
  constructor(
    @Inject(ModelsEnum.ClassSchedule)
    private readonly classSchedule: PickModelType<ModelsEnum.ClassSchedule>,
    @Inject(ModelsEnum.Class)
    private readonly classModle: PickModelType<ModelsEnum.Class>,
    @Inject(ModelsEnum.User)
    private readonly userModel: PickModelType<ModelsEnum.User>,
    @Inject(ModelsEnum.Course)
    private readonly course: PickModelType<ModelsEnum.Course>,
    private readonly classScheduleServe: ClassscheduleService,
  ) {}

  @Post('create')
  async create(@Body() pram: any) {
    await this.classSchedule.create(pram, {
      fields: ['classId', 'courseId', 'starDate', 'endDate'],
    });
    return { message: '下发成功' };
  }

  /**
    老师的班级
    1. 查询classCchedule下面有哪一些课程属于我的
    2. 然后按照班级分组查询
   */
  @Get('getTeacherClass')
  @Auth()
  async getTeacherClass(@User() user) {
    const data = this.classModle.findAll({
      include: [
        {
          required: true,
          association: 'course',
          where: {
            userId: user.userId,
          },
          through: {
            where: {
              isEnd: false,
              starDate: {
                [Op.lte]: new Date(),
              },
              endDate: {
                [Op.gte]: new Date(),
              },
            },
          },
        },
        { association: 'teacher' },
      ],
    });

    return data;
  }

  // 查询班级课程
  @Get('getStudentClass')
  @Auth()
  async getStudentClass(@User() user) {
    if (!user.classId) return [];
    const data = this.course.findAll({
      include: [
        {
          required: true,
          association: 'class',
          where: {
            classId: user.classId,
          },
          through: {
            where: {
              isEnd: false,
              starDate: {
                [Op.lte]: new Date(),
              },
              endDate: {
                [Op.gte]: new Date(),
              },
            },
          },
        },

        { association: 'user' },
      ],
    });

    return data;
  }

  // 查看某个课程的上课情况
  @Get('checkCourse/:id')
  async checkCourse(@Param() pram: any) {
    return await this.classSchedule.findOne({
      where: { classScheduleId: pram.id, isEnd: false },
      include: [
        { association: 'classHours', include: ['time', 'timing'] },
        { association: 'course', required: true },
        { association: 'class' },
      ],
    });
  }

  // 查看某个班级的所有课程情况
  @Get('checkClassCourse/:id')
  async checkClassCourse(@Param() pram: any) {
    return await this.classSchedule.findAll({
      where: { classId: pram.id, isEnd: false },
      include: [
        {
          association: 'class',
        },
        { association: 'classHours', include: ['time', 'timing'] },
        {
          association: 'course',
          include: ['user'],
        },
      ],
    });
  }

  // 删除接口
  @Post('delete')
  @Auth()
  async deleteSchdule(@Body() { classScheduleId }: any) {
    await this.classScheduleServe.deleteSchedule(classScheduleId);

    return { message: '删除成功' };
  }

  // 获取自己已经下发的课程 只能获取已经开始的并且未结束的
  @Get('getClassChedule')
  @Auth()
  async getClassChedule(@User() user) {
    return await this.classSchedule.findAll({
      where: {
        starDate: { [Op.lte]: new Date() },
        endDate: { [Op.gte]: new Date() },
        isEnd: false,
      },
      include: [
        {
          required: true,
          association: 'course',
          where: {
            userId: user.userId,
          },
        },
        {
          association: 'class',
        },
      ],
    });
  }

  // 获取课程学生按照 积分排名
  @Get('getSchduleStudents/:classScheduleId')
  async getSchduleStudents(@Param() { classScheduleId }: any) {
    return await this.classSchedule.findOne({
      where: { classScheduleId },
      include: [
        {
          association: 'class',
          include: [
            {
              association: 'studnets',
              where: { isBan: false },
              include: [
                {
                  association: 'statInfo',
                  include: [{ association: 'singTask' }],
                },
              ],
            },
          ],
        },
      ],
    });
  }
}
