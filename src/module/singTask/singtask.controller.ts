/*
https://docs.nestjs.com/controllers#controllers
*/

import { Auth } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { ScheduleService } from '../schedule/schedule.service';

@Controller('singTask')
export class SingTaskController {
  constructor(
    @Inject(ModelsEnum.SingTask)
    private readonly singTask: PickModelType<ModelsEnum.SingTask>,

    private readonly schedule: ScheduleService,
  ) {}

  //   创建签到

  @Post('create')
  @Auth()
  async create(@Body() { classScheduleId }: any) {
    // 定时  创建时间
    const scheduleName = nanoid();
    await this.singTask.create({
      scheduleName,
      taskName: '测试的签到test',
      classScheduleId: classScheduleId,
      integral: 20,
      taskTime: new Date(),
    });
    await this.schedule.addTimeout(scheduleName, 20);
    return { message: '发起成功' };
  }

  // 获取签到
  @Get('getTask/:classId')
  @Auth()
  async getTask(@Param() payload: any) {
    return await this.singTask.findAll({
      where: { isEnd: false },
      include: {
        association: 'classSchedule',
        where: {
          classId: payload.classId,
        },
      },
    });
  }
}
