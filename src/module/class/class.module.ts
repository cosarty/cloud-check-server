import { ClassScheduleModule } from '../classSchedule/classschedule.module';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [ClassScheduleModule],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
