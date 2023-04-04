/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { StatInfoController } from './statinfo.controller';

@Module({
  imports: [],
  controllers: [StatInfoController],
  providers: [],
})
export class StatInfoModule {}
