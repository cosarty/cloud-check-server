/*
https://docs.nestjs.com/controllers#controllers
*/

import { ModelsEnum, PickModelType } from '@/models';
import { Body, Controller, Delete, Inject, Param, Post } from '@nestjs/common';

@Controller('classHourse')
export class ClassHoursController {
  constructor(
    @Inject(ModelsEnum.ClassHours)
    private readonly classHourse: PickModelType<ModelsEnum.ClassHours>,
    @Inject(ModelsEnum.TimingTask)
    private readonly timing: PickModelType<ModelsEnum.TimingTask>,
  ) {}

  // 创建时间
  @Post('create')
  async create(@Body() pram: any) {
    const data = await this.classHourse.create(pram, {
      fields: ['classScheduleId', 'timeId', 'weekDay'],
    });
    return { message: '设置成功', data };
  }

  @Delete('del/:id')
  async deleteHourse(@Param() param: any) {
    const data = await this.classHourse.findOne({
      where: { classHoursId: param.id },
    });
    // 删除定时任务
    if (data) {
      await this.timing.destroy({ where: { timingId: data.timingId } });
      data.destroy();
    }
    // 删除定时任务名字
    return { message: '删除成功' };
  }
}