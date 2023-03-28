/*
https://docs.nestjs.com/controllers#controllers
*/

import { ModelsEnum, PickModelType } from '@/models';
import { Body, Controller, Inject, Post } from '@nestjs/common';

@Controller('classHourse')
export class ClassHoursController {
  constructor(
    @Inject(ModelsEnum.ClassHours)
    private readonly classHourse: PickModelType<ModelsEnum.ClassHours>,
  ) {}

  // 创建时间
  @Post('create')
  async create(@Body() pram: any) {
    await this.classHourse.create(pram, {
      fields: ['classScheduleId', 'timeId', 'timingId', 'weekDay'],
    });
    return { message: '设置成功' };
  }
}
