/*
https://docs.nestjs.com/providers#services
*/

import { ModelsEnum, PickModelType } from '@/models';
import { Inject, Injectable } from '@nestjs/common';
import { ClassHoursService } from '../classHours/classhours.service';

@Injectable()
export class ClassscheduleService {

  constructor( @Inject(ModelsEnum.ClassSchedule)
  private readonly classSchedule: PickModelType<ModelsEnum.ClassSchedule>,
  private readonly clssHoursServe: ClassHoursService,
  ) {
    
  }


  async deleteSchedule(classScheduleId:string) {
    await this.clssHoursServe.deleteSchHours(classScheduleId)
    await this.classSchedule.destroy({where:{classScheduleId}})
  }

}
