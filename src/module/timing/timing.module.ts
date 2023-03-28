import { TimingController } from './timing.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [TimingController],
  providers: [],
})
export class TimingModule {}
