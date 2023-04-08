import { ClassscheduleService } from './classschedule.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ClassScheduleController } from './classschedule.controller';
import { ClassHoursModule } from '../classHours/classhours.module';
import { ScheduleModule } from '../schedule/schedule.module';

@Module({
  imports: [ClassHoursModule,ScheduleModule],
  controllers: [ClassScheduleController],
  providers: [ClassscheduleService],
  exports:[ClassscheduleService]
})
export class ClassScheduleModule {}
