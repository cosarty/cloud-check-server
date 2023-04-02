import { AreaController } from './area.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [AreaController],
  providers: [],
})
export class AreaModule {}
