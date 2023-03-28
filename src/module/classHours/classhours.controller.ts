/*
https://docs.nestjs.com/controllers#controllers
*/

import { User } from '@/common/decorator/user.decorator';
import { Auth } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import { Body, Controller, Delete, Inject, Param, Post } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { ScheduleService } from '../schedule/schedule.service';

@Controller('classHourse')
export class ClassHoursController {
  constructor(
    @Inject(ModelsEnum.ClassHours)
    private readonly classHourse: PickModelType<ModelsEnum.ClassHours>,
    @Inject(ModelsEnum.TimingTask)
    private readonly timing: PickModelType<ModelsEnum.TimingTask>,

    private readonly schedule: ScheduleService,
  ) {}

  // 创建时间
  @Post('create')
  @Auth()
  async create(@Body() pram: any, @User() user) {
    // 课前几分钟发起签到
    const keepTime = pram.keepTime;
    // 设置定时任务
    const scheduleName = nanoid();

    const rule = await this.schedule.getClassHoursTaskCorn({
      ...pram,
      keepTime,
    });
    await this.schedule.addTimingTask(scheduleName, rule);

    const timing = await this.timing.create(
      {
        ...pram,
        scheduleName: scheduleName,
        taskName: pram.weekDay + '课程自动轮询',
        userId: user.userId,
        period: rule,
      },
      {
        fields: [
          'classScheduleId',
          'taskName',
          'scheduleName',
          'userId',
          'isPeriod',
          'period',
        ],
      },
    );

    await this.classHourse.create(
      { ...pram, timingId: timing.timingId },
      {
        fields: ['classScheduleId', 'timeId', 'weekDay', 'timingId'],
      },
    );

    return { message: '设置成功' };
  }

  @Delete('del/:id')
  async deleteHourse(@Param() param: any) {
    const data = await this.classHourse.findOne({
      where: { classHoursId: param.id },
    });
    if (data) {
      const ti = await this.timing.findOne({
        where: { timingId: data.timingId },
      });
      await data.destroy();
      if (ti) {
        await this.schedule.deleteCron(ti.scheduleName);
        await ti.destroy();
      }
    }
    // 删除定时任务
    return { message: '删除成功' };
  }
}
