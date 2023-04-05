/*
https://docs.nestjs.com/controllers#controllers
*/

import { Auth } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ScheduleService } from '../schedule/schedule.service';
import { User } from '@/common/decorator/user.decorator';
import { Op } from 'sequelize';

@Controller('timing')
export class TimingController {
  // 查询定时任务的时候要判断是否过期
  //   如果过期了就设置isEnd===true
  constructor(
    @Inject(ModelsEnum.TimingTask)
    private readonly timingTask: PickModelType<ModelsEnum.TimingTask>,
    @Inject(ModelsEnum.ClassHours)
    private readonly classHours: PickModelType<ModelsEnum.ClassHours>,
    private readonly schedule: ScheduleService,
  ) {}
  // 获取定时任务
  @Post('getList')
  @Auth()
  async getList(
    @Body()
    {
      taskName,
      courseName,
      pageSize,
      pageCount,
      className,
      isHistory = false,
    }: any,
    @User() user,
  ) {
    return await this.timingTask.findAndCountAll({
      order: [['createdAt', 'DESC']],
      ...(pageSize ? { limit: Number(pageSize) ?? 0 } : {}),
      ...(pageCount ? { offset: Number((pageCount - 1) * pageSize) ?? 0 } : {}),
      include: [
        {
          required: true,
          association: 'classSchedule',
          include: [
            {
              association: 'course',
              where: {
                ...(courseName
                  ? { courseName: { [Op.substring]: courseName } }
                  : {}),
              },
            },
            {
              association: 'class',
              where: {
                ...(className
                  ? { className: { [Op.substring]: className } }
                  : {}),
              },
            },
          ],
        },
      ],
      where: {
        ...(taskName ? { taskName: { [Op.substring]: taskName } } : {}),
        isEnd: isHistory,
        userId: user.userId,
      },
    });
  }

  // 结束结束定时任务
  @Post('endTask')
  async endTask(@Body() { timingId }: any) {
    console.log('timingId: ', timingId);
    /**
     * 结束掉定时任务
     * 
     *
     */
    const timing = await this.timingTask.findByPk(timingId);
    console.log('timing: ', timing);

    // 删除定时任务
    this.schedule.deleteCron(timing.scheduleName);
     timing.isEnd = true;
    await timing.save()
    await this.classHours.update({ timingId: null }, {
      where: {
        timingId,
      },
    });

    return { message: '结束成功' };
  }


  @Post('deleteTask')
  async delTask(@Body() { timingId }: any) {
    
    await this.timingTask.destroy({
       where:{timingId}
     });
    

    return { message: '删除成功' };
  }
}
