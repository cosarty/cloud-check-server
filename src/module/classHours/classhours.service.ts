/*
https://docs.nestjs.com/providers#services
*/

import { ModelsEnum, PickModelType } from '@/models';
import { Inject, Injectable } from '@nestjs/common';
import { ScheduleService } from '../schedule/schedule.service';

@Injectable()
export class ClassHoursService {
  constructor(
    @Inject(ModelsEnum.ClassHours)
    private readonly classHourse: PickModelType<ModelsEnum.ClassHours>,
    @Inject(ModelsEnum.TimingTask)
    private readonly timing: PickModelType<ModelsEnum.TimingTask>,

    private readonly schedule: ScheduleService,
  ) {}

  // 删除上课时间
  async deleteHourse(id: string) {
    const data = await this.classHourse.findOne({
      where: { classHoursId: id },
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
  }

  async deleteSchHours(classScheduleId: any) {
    const data = await this.classHourse.findAll({ where: { classScheduleId } });
    for (const d of data) {
      const ti = await this.timing.findOne({
        where: { timingId: d.timingId },
      });
      await d.destroy();
      if (ti) {
        await ti.destroy();
        this.schedule.deleteCron(ti.scheduleName);
      }
    }
  }
}
