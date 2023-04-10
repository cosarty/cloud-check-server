/*
https://docs.nestjs.com/controllers#controllers
*/

import { User } from '@/common/decorator/user.decorator';
import { Auth } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';

@Controller('area')
export class AreaController {
  constructor(
    @Inject(ModelsEnum.Area)
    private readonly area: PickModelType<ModelsEnum.Area>,
    @Inject(ModelsEnum.SingTask)
    private readonly singTask: PickModelType<ModelsEnum.SingTask>,
    @Inject(ModelsEnum.TimingTask)
    private readonly timingTask: PickModelType<ModelsEnum.TimingTask>,
  ) {}

  @Post('create')
  @Auth()
  async create(@Body() data, @User() user) {
    await this.area.create(
      { ...data, userId: user.userId },
      {
        fields: ['userId', 'locationName', 'areaName', 'location'],
      },
    );
    return { message: '创建成功' };
  }

  @Post('update')
  @Auth()
  async update(@Body() data, @User() user) {
    const { areaId, ...res } = data;
    await this.area.update(res, {
      where: {
        userId: user.userId,
        areaId: data.areaId,
      },
    });

    await this.singTask.update(
      { areaId: null },
      {
        where: {
          areaId,
        },
      },
    );
    await this.timingTask.update(
      { areaId: null },
      {
        where: {
          areaId,
        },
      },
    );
    return { message: '更新成功' };
  }

  @Delete('delete/:areaId')
  @Auth()
  async delete(@Param() data, @User() user) {
    const { areaId } = data;
    console.log('areaId: ', areaId);
    await this.area.destroy({
      where: {
        userId: user.userId,
        areaId,
      },
    });
    return { message: '删除成功' };
  }

  @Get('getList')
  @Auth()
  async getList(@User() user, @Query() pram: any) {
    return this.area.findAndCountAll({
      order: [['createdAt', 'DESC']],
      ...(pram.pageSize ? { limit: Number(pram.pageSize) ?? 0 } : {}),
      ...(pram.pageCount
        ? { offset: Number((pram.pageCount - 1) * pram.pageSize) ?? 0 }
        : {}),
      where: {
        userId: user.userId,
      },
    });
  }
}
