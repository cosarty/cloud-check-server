/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ScheduleModule } from '../schedule/schedule.module';
import { SingTaskController } from './singtask.controller';

@Module({
  imports: [ScheduleModule],
  controllers: [SingTaskController],
  providers: [],
})
export class SingTaskModule {}
