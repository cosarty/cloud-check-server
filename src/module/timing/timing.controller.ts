import { Auth } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ScheduleService } from '../schedule/schedule.service';
import { User } from '@/common/decorator/user.decorator';
import { Op } from 'sequelize';
import * as dayjs from 'dayjs';

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
    // 83cbc873-e219-475c-adb0-36f4604772d2

    return await this.timingTask.findAndCountAll({
      order: [['createdAt', 'DESC']],
      ...(pageSize ? { limit: Number(pageSize) ?? 0 } : {}),
      ...(pageCount ? { offset: Number((pageCount - 1) * pageSize) ?? 0 } : {}),
      include: [
        {
          required: true,
          association: 'classSchedule',
          where: {
            ...(isHistory
              ? {}
              : {
                  isEnd: false,
                  starDate: {
                    [Op.lte]: new Date(),
                  },
                  endDate: {
                    [Op.gte]: new Date(),
                  },
                }),
          },
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
        {
          association: 'classHours',
          include: [{ association: 'time' }],
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
    const timing = await this.timingTask.findByPk(timingId);
    // 删除定时任务
    this.schedule.deleteCron(timing.scheduleName);
    timing.isEnd = true;
    await timing.save();
    await this.classHours.update(
      { timingId: null },
      {
        where: {
          timingId,
        },
      },
    );

    return { message: '结束成功' };
  }

  @Post('deleteTask')
  async delTask(@Body() { timingId }: any) {
    await this.timingTask.destroy({
      where: { timingId },
    });

    return { message: '删除成功' };
  }

  // 更新 目前只做 更新定时和人脸识别
  @Post('updateTask')
  async updateTask(@Body() data: any) {
    // 其他的话就直接入库

    const taskInfo = await this.timingTask.findByPk(data.timingId);
    await this.timingTask.update(
      { ...data },
      { where: { timingId: data.timingId } },
    );

    taskInfo.set({ ...data });
    await taskInfo.save();

    return { message: '更新成功' };
  }
}
