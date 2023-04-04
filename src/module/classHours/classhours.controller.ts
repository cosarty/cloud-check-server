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
    const keepTime = pram.keepTime ?? 1;

    const isFace = pram.isFace ?? false;
    const isPeriod = pram.isPeriod ?? false;
    let timing;

    // 设置定时任务
    const scheduleName = nanoid();

    const rule = await this.schedule.getClassHoursTaskCorn({
      ...pram,
    });

    if (isPeriod) {
      // 判断是否开启定时任务
      await this.schedule.addTimingTask(scheduleName, rule);
    }

    // 创建定时任务数据
    timing = await this.timing.create(
      {
        ...pram,
        scheduleName: scheduleName,
        taskName: pram.weekDay + '课程自动轮询',
        userId: user.userId,
        period: rule,
        integral: keepTime * 60, // 持续时间
        isFace,
        isPeriod,
      },
      {
        fields: [
          'classScheduleId',
          'taskName',
          'scheduleName',
          'userId',
          'isPeriod',
          'period',
          'isFace',
          'integral',
        ],
      },
    );

    await this.classHourse.create(
      { ...pram, ...(timing ? { timingId: timing.timingId } : {}) },
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
        await ti.destroy();
        this.schedule.deleteCron(ti.scheduleName);
      }
    }
    // 删除定时任务
    return { message: '删除成功' };
  }

  @Post('update')
  @Auth()
  async updateHors(@Body() pram: any, @User() user) {
    const {
      isFace = false,
      keepTime: integral = 1,
      isPeriod = false,
      classScheduleId,
    } = pram;

    //  更新classhours 数据
    const hours = await this.classHourse.findByPk(pram.classHoursId);

    //如果有开启定时任务就 更新timing数据  没有开启的话判断一下之前是否有开启 如果有的话就删除
    if (hours?.timingId) {
      const timing = await hours.getTiming();
      //  更新 定时数据
      await this.timing.update(
        { isFace, integral: integral * 60, isPeriod },
        { where: { timingId: hours.timingId, userId: user.userId } },
      );

      if (timing.isPeriod !== pram.isPeriod) {
        if (!pram.isPeriod) {
          // 删除定时任务
          this.schedule.deleteCron(timing.scheduleName);
        } else {
          // 添加定时任务
          await this.schedule.addTimingTask(timing.scheduleName, timing.period);
        }
      }
    } else if (!hours?.timingId && pram.isPeriod) {
      // 创建定时任务
      const scheduleName = nanoid();

      const rule = await this.schedule.getClassHoursTaskCorn({
        classScheduleId,
        timeId: hours.timeId,
        weekDay: hours.weekDay,
      });
      await this.schedule.addTimingTask(scheduleName, rule);

      // 创建定时任务数据
      const timig = await this.timing.create(
        {
          scheduleName: scheduleName,
          taskName: hours.weekDay + '课程自动轮询',
          userId: user.userId,
          period: rule,
          integral: integral * 60, // 持续时间
          isFace,
          isPeriod,
          classScheduleId,
        },
        {
          fields: [
            'classScheduleId',
            'taskName',
            'scheduleName',
            'userId',
            'isPeriod',
            'period',
            'isFace',
            'integral',
          ],
        },
      );

      await this.classHourse.update(
        { timingId: timig.timingId },
        {
          where: {
            classHoursId: pram.classHoursId,
          },
        },
      );
    }

    return { message: '更新成功' };
  }
}
