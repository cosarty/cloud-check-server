/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller } from '@nestjs/common';

@Controller('timing')
export class TimingController {
  // 查询定时任务的时候要判断是否过期
  //   如果过期了就设置isEnd===true
}
