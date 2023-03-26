/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ClassScheduleController } from './classschedule.controller';

@Module({
  imports: [],
  controllers: [ClassScheduleController],
  providers: [],
})
export class ClassScheduleModule {}
