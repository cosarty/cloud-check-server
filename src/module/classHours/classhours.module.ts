import { Module } from '@nestjs/common';
import { ScheduleModule } from '../schedule/schedule.module';
import { ClassHoursController } from './classhours.controller';
import { ClassHoursService } from './classhours.service';

@Module({
  imports: [ScheduleModule],
  controllers: [ClassHoursController],
  providers: [ClassHoursService],
  exports:[ClassHoursService]
})
export class ClassHoursModule {}
