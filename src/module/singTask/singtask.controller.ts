import { Auth } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { ScheduleService } from '../schedule/schedule.service';
import { User } from '@/common/decorator/user.decorator';
import { Op } from 'sequelize';
import * as dayjs from 'dayjs';


@Controller('singTask')
export class SingTaskController {
  constructor(
    @Inject(ModelsEnum.SingTask)
    private readonly singTask: PickModelType<ModelsEnum.SingTask>,
    @Inject(ModelsEnum.StatInfo)
    private readonly statInfo: PickModelType<ModelsEnum.StatInfo>,
    private readonly schedule: ScheduleService,
  ) {}

  //   创建签到
  @Post('create')
  @Auth()
  async create(@Body() data: any, @User() user) {
    // console.log('data: ', data);
    const scheduleName = nanoid();
    await this.singTask.create(
      {
        ...data,
        userId: user.userId,
        integral: data.integral * 60,
        taskTime: data.isCurrent ? new Date() : data.taskTime,
        scheduleName,
      },
      {
        fields: [
          'classScheduleId',
          'sustain',
          'distance',
          'taskTime',
          'taskName',
          'scheduleName',
          'integral',
          'isFace',
          'areaId',
          'userId',
          'locationName',
          'location',
        ],
      },
    );

    // 判断是不是直接执行的
    if (data.isCurrent) {
      await this.schedule.addTimeout(scheduleName, (data.integral ?? 1) * 60);
    } else {
      // 开启定时任务
      await this.schedule.singTaskCorn(scheduleName, new Date(data.taskTime));
    }

    return { message: '发起成功' };
  }

  // 获取签到
  @Get('getTask/:classId')
  @Auth()
  async getTask(@Param() payload: any) {
    return await this.singTask.findAll({
      where: { isEnd: false },
      include: {
        association: 'classSchedule',
        where: {
          classId: payload.classId,
        },
      },
    });
  }
  // 获取当前自己创建的未开始任务
  @Post('getSingTask')
  @Auth()
  async getSingTask(
    @Body()
    { isHistory = false, pageSize, pageCount, className, courseName }: any,
    @User() user,
  ) {
    return await this.singTask.findAndCountAll({
      order: [['createdAt', 'DESC']],
      ...(pageSize ? { limit: Number(pageSize) ?? 0 } : {}),
      ...(pageCount ? { offset: Number((pageCount - 1) * pageSize) ?? 0 } : {}),
      where: {
        isRun: false,
        isEnd: isHistory,
        userId: user.userId,
        ...(isHistory ? {} : { taskTime: { [Op.gte]: new Date() } }),
      },
      include: [
        { association: 'area' },
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
      ],
    });
  }

  // 正在运行的任务
  @Post('getCurrentTask')
  @Auth()
  async getCurrentTask(
    @User() user,
    @Body() { pageSize, pageCount, className, courseName }: any,
  ) {
    return await this.singTask.findAndCountAll({
      order: [['createdAt', 'DESC']],
      ...(pageSize ? { limit: Number(pageSize) ?? 0 } : {}),
      ...(pageCount ? { offset: Number((pageCount - 1) * pageSize) ?? 0 } : {}),
      where: {
        isEnd: false,
        userId: user.userId,
        isRun: true,
      },
      include: {
        required: true,
        association: 'classSchedule',
        where: {
          isEnd: false,
          starDate: {
            [Op.lte]: new Date(),
          },
          endDate: {
            [Op.gte]: new Date(),
          },
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
    });
  }

  // 结束定时任务
  @Post('endTask')
  @Auth()
  async endTask(@Body() { singTaskId }: any) {
    const sing = await this.singTask.findByPk(singTaskId);
    // 删除定时任务
    this.schedule.deleteCron(sing.scheduleName);
    sing.isEnd = true;
    sing.isRun = false;
    await sing.save();
    return { message: '结束成功' };
  }

  // 删除定时任务
  // 删除的话记录都会消失
  @Post('deleteTask')
  async delTask(@Body() { singTaskId }: any) {
    await this.singTask.destroy({
      where: { singTaskId },
    });
    await this.statInfo.destroy({
      where: { singTaskId },
    });
    return { message: '删除成功' };
  }

  // 更新定时任务
  @Post('updateSingTask')
  @Auth()
  async updateSingTask(@Body() data: any) {
    // 如果更新了时间的话 就重新启动定时任务
    // 其他的话就直接入库

    const singInfo = await this.singTask.findByPk(data.singTaskId);

    // 如果签到时间不一致的话就重置定时任务
    if (!dayjs(singInfo.taskTime).isSame(dayjs(data.taskTime))) {
      data.scheduleName = nanoid();
      // 停止定时任务
      this.schedule.deleteCron(singInfo.scheduleName);
      // 重新开启
      this.schedule.singTaskCorn(data.scheduleName, new Date(data.taskTime));
    }
    singInfo.set({ ...data });
    await singInfo.save();

    return { message: '更新成功' };
  }
}
