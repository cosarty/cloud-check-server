import { CourseService } from './course.service';
import { CourseController } from './course.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ClassScheduleModule } from '../classSchedule/classschedule.module';

@Module({
  imports: [ClassScheduleModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports:[CourseService]
})
export class CourseModule {}
