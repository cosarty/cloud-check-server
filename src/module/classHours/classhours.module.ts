import { Module } from '@nestjs/common';
import { ClassHoursController } from './classhours.controller';

@Module({
  imports: [],
  controllers: [ClassHoursController],
  providers: [],
})
export class ClassHoursModule {}
