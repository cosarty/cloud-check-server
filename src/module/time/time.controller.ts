/*
https://docs.nestjs.com/controllers#controllers
*/

import { ModelsEnum, PickModelType } from '@/models';
import { getId } from '@/util/utils';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { where } from 'sequelize';

@Controller('time')
export class TimeController {
  constructor(
    @Inject(ModelsEnum.Time)
    private readonly time: PickModelType<ModelsEnum.Time>,
  ) {}

  //   更新时间
  @Post('updateTime')
  async updateTime(@Body() param: any) {
    await Promise.all(
      param.map(async ({ endTime, startTime }, id) => {
        const time = await this.time.findOne({ where: { id: id + 1 } });
        if (time) {
          await this.time.update(
            {
              ...(startTime ? { startTime } : {}),
              ...(endTime ? { endTime } : {}),
            },
            { where: { id: id + 1 } },
          );
        } else {
          await this.time.create({
            id: id + 1,
            timeId: getId(),
            ...(startTime ? { startTime } : {}),
            ...(endTime ? { endTime } : {}),
          });
        }
      }),
    );

    return { message: '更新成功' };
  }

  // 获取时间

  @Get('getTime')
  async getTime() {
    return await this.time.findAll({ order: [['id', 'ASC']] });
  }
}
