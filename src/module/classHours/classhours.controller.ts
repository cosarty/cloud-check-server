/*
https://docs.nestjs.com/controllers#controllers
*/

import { User } from '@/common/decorator/user.decorator';
import { Auth } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import { Body, Controller, Delete, Inject, Param, Post } from '@nestjs/common';
import { nanoid } from 'nanoid';

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
  @Auth()
  async create(@Body() pram: any, @User() user) {
    const data = await this.classHourse.create(pram, {
      fields: ['classScheduleId', 'timeId', 'weekDay'],
    });
    // 设置定时任务
    const scheduleName = nanoid();
    await this.timing.create(
      {
        ...pram,
        scheduleName: scheduleName,
        taskName: pram.weekDay + '课程自动轮询',
        userId: user.userId,
      },
      {
        fields: ['classScheduleId', 'taskName', 'scheduleName', 'userId'],
      },
    );
    return { message: '设置成功', data };
  }

  @Delete('del/:id')
  async deleteHourse(@Param() param: any) {
    const data = await this.classHourse.findOne({
      where: { classHoursId: param.id },
    });

    if (data) {
      await this.timing.destroy({ where: { timingId: data.timingId } });
      data.destroy();
    }
    // 删除定时任务
    return { message: '删除成功' };
  }
}
