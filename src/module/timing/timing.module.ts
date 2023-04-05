import { ScheduleModule } from '../schedule/schedule.module';
import { TimingController } from './timing.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [ScheduleModule],
  controllers: [TimingController],
  providers: [],
})
export class TimingModule {}
