import { HomeController } from './home.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [HomeController],
  providers: [],
})
export class HomeModule {}
