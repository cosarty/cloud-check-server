/*
https://docs.nestjs.com/controllers#controllers
*/

import { User } from '@/common/decorator/user.decorator';
import { Auth } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';

@Controller('course')
export class CourseController {
  constructor(
    @Inject(ModelsEnum.Course)
    private readonly course: PickModelType<ModelsEnum.Course>,
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
    if (user.super) return await this.course.findAndCountAll();
    return await this.course.findAndCountAll({
      where: { userId: user.userId },
    });
  }

  @Post('update')
  @Auth()
  async updateCourse(@Body() pram: any, @User() user) {
    const userId = pram.userId ?? user.userId;
    await this.course.update(
      { ...pram },
      {
        where: { userId },
      },
    );

    return { message: '更新成功' };
  }
}
