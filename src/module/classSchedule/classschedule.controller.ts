import { User } from '@/common/decorator/user.decorator';
import { Auth } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';

@Controller('classSchedule')
export class ClassScheduleController {
  constructor(
    @Inject(ModelsEnum.ClassSchedule)
    private readonly classSchedule: PickModelType<ModelsEnum.ClassSchedule>,
    @Inject(ModelsEnum.Class)
    private readonly classModle: PickModelType<ModelsEnum.Class>,
    @Inject(ModelsEnum.Course)
    private readonly course: PickModelType<ModelsEnum.Course>,
  ) {}

  @Post('create')
  async create(@Body() pram: any) {
    console.log('pram: ', pram);

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
      where: { classScheduleId: pram.id },
      include: [{ association: 'classHours', include: ['time', 'timing'] }],
    });
  }

  // 查看某个班级的所有课程情况
  @Get('checkClassCourse/:id')
  async checkClassCourse(@Param() pram: any) {
    return await this.classSchedule.findAll({
      where: { classId: pram.id },
      include: [
        { association: 'classHours', include: ['time', 'timing'] },
        { association: 'course', include: ['user'] },
      ],
    });
  }
}
