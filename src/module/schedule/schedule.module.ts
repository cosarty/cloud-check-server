import { ScheduleService } from './schedule.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
