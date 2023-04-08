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
    await this.classSchedule.destroy({ where: { classScheduleId } });
  }
}
