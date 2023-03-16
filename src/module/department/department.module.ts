import { DepartmentController } from './department.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [DepartmentController],
  providers: [],
})
export class DepartmentModule {}
