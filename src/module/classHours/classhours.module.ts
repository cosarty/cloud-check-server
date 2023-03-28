import { Module } from '@nestjs/common';
import { ScheduleModule } from '../schedule/schedule.module';
import { ClassHoursController } from './classhours.controller';

@Module({
  imports: [ScheduleModule],
  controllers: [ClassHoursController],
  providers: [],
})
export class ClassHoursModule {}
