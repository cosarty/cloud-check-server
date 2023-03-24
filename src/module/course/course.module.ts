import { CourseController } from './course.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [CourseController],
  providers: [],
})
export class CourseModule {}
