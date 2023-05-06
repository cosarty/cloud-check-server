/*
https://docs.nestjs.com/providers#services
*/

import { ModelsEnum, PickModelType } from '@/models';
import { Inject, Injectable } from '@nestjs/common';
import { ClassHoursService } from '../classHours/classhours.service';
import { ScheduleService } from '../schedule/schedule.service';

@Injectable()
export class ClassscheduleService {
  constructor(
    @Inject(ModelsEnum.ClassSchedule)
    private readonly classSchedule: PickModelType<ModelsEnum.ClassSchedule>,
    private readonly clssHoursServe: ClassHoursService,
    @Inject(ModelsEnum.SingTask)
    private readonly singTask: PickModelType<ModelsEnum.SingTask>,
    @Inject(ModelsEnum.TimingTask)
    private readonly timing: PickModelType<ModelsEnum.TimingTask>,

    private readonly schedule: ScheduleService,
  ) {}

  async deleteSchedule(classScheduleId: string) {
    await this.clssHoursServe.deleteSchHours(classScheduleId);
    // 删除单次任务
    const sing = await this.singTask.findAll({ where: { classScheduleId } });
    for (const sin of sing) {
      // 停止所有的定时任务
      this.schedule.deleteCron(sin.scheduleName);
      await sin.destroy();
    }
    this.schedule.deleteCron(classScheduleId);
    await this.classSchedule.destroy({ where: { classScheduleId } });
  }

  // 停止课程
  async endCourse(classScheduleId: string) {
    const timing = await this.timing.findAll({
      where: {
        classScheduleId,
      },
    });

    for (const tim of timing) {
      this.schedule.deleteCron(tim.taskName);
      tim.isEnd = true;
      await tim.save();
    }

    const sings = await this.singTask.findAll({
      where: {
        classScheduleId,
      },
    });
    for (const sing of sings) {
      this.schedule.deleteCron(sing.taskName);
      sing.isEnd = true;
      await sing.save();
    }

    // 停止定时器
    this.schedule.deleteCron(classScheduleId);
    // 设置状态
    await this.classSchedule.update(
      { isEnd: true },
      { where: { classScheduleId } },
    );
  }
}
