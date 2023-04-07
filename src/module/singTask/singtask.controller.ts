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
  async create(@Body() data: any) {
    const scheduleName = nanoid();
    await this.singTask.create(
      {
        ...data,
      },
      {
        fields: [
          'classScheduleId',
          'sustain',
          'distance',
          'taskTime',
          'taskName',
          'scheduleName',
          'integral',
        ],
      },
    );

    // 判断是不是直接执行的
    if (data.isCurrent) {
      await this.schedule.addTimeout(scheduleName, data.integral ?? 60);
    } else {
      // 开启定时任务
    }

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
