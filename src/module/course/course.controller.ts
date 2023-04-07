/*
https://docs.nestjs.com/controllers#controllers
*/

import { User } from '@/common/decorator/user.decorator';
import { Auth } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClassscheduleService } from '../classSchedule/classschedule.service';

@Controller('course')
export class CourseController {
  constructor(
    @Inject(ModelsEnum.Course)
    private readonly course: PickModelType<ModelsEnum.Course>,
    @Inject(ModelsEnum.ClassSchedule)
    private readonly classSchedule: PickModelType<ModelsEnum.ClassSchedule>,
    @Inject(ModelsEnum.ClassHours)
    private readonly classHours: PickModelType<ModelsEnum.ClassHours>,
    private readonly classSchduelServe: ClassscheduleService,
  ) {}

  // 创建课程
  @Post('create')
  @Auth()
  async create(@Body() pram: any, @User() user) {
    const userId = pram.userId ?? user.userId;
    await this.course.create(
      { ...pram, userId },
      {
        fields: ['courseName', 'picture', 'comment', 'userId'],
      },
    );

    return { message: '创建成功' };
  }

  @Get('get')
  @Auth()
  async getCourseList(@Query() pram: any, @User() user) {
    if (user.super)
      return await this.course.findAndCountAll({
        include: 'user',
        order: [['createdAt', 'DESC']],
      });
    return await this.course.findAndCountAll({
      where: { userId: user.userId },
      include: 'user',
      order: [['createdAt', 'DESC']],
    });
  }

  @Post('update')
  @Auth()
  async updateCourse(@Body() pram: any, @User() user) {
    await this.course.update(
      { ...pram },
      {
        where: { courseId: pram.courseId },
      },
    );

    return { message: '更新成功' };
  }

  @Post('delete/:courseId')
  @Auth()
  async delteCourse(@Param() pram: any) {
    const chedule = await this.classSchedule.findAll({
      where: {
        courseId: pram.courseId,
      },
    });

    // 删除classSchdule
    for (const ch of chedule) {
      await this.classSchduelServe.deleteSchedule(ch.classScheduleId)
    }
   
    await this.course.destroy({
      where: {
        courseId: pram.courseId,
      },
    });

    return { message: '删除成功' };
  }

  @Get('getInfo/:id')
  @Auth()
  async getInfo(@Param() pram: any) {
    return await this.course.findOne({
      where: { courseId: pram.id },
      include: 'user',
    });
  }
}
