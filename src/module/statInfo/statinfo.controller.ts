import { User } from '@/common/decorator/user.decorator';
import { Auth } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import sequelize from 'sequelize';
import { Op } from 'sequelize';

@Controller('statinfo')
export class StatInfoController {
  constructor(
    @Inject(ModelsEnum.StatInfo)
    private readonly statInfo: PickModelType<ModelsEnum.StatInfo>,
    @Inject(ModelsEnum.SingTask)
    private readonly singTask: PickModelType<ModelsEnum.SingTask>,
  ) {}

  // 签到
  @Post('create')
  @Auth()
  async create(@Body() data, @User() user) {
    console.log('data: ', data);
    // 签到
    await this.statInfo.create(
      { ...data, userId: user.userId, statTime: new Date() },
      {
        fields: [
          'userId',
          'statTime',
          'location',
          'locationName',
          'singTaskId',
          'classScheduleId',
          'type',
          'sustain',
          'tagetScope',
        ],
      },
    );
    return { message: '签到成功' };
  }

  // 统计某一个学生的某一门课的情况
  @Post('stat')
  @Auth()
  async stat(@Body() data) {
    // console.log('data: ', data);
    // 获取总数
    const all = await this.singTask.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          required: true,
          association: 'classSchedule',
          where: {
            classScheduleId: data.classScheduleId,
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
            },
            {
              association: 'class',
            },
          ],
        },
      ],
      where: {
        isEnd: true,
      },
    });
    // console.log('all: ', all);

    // 总积分
    const allintegral = await this.singTask.findOne({
      order: [['createdAt', 'DESC']],
      attributes: [[sequelize.fn('SUM', sequelize.col('sustain')), 'sustains']],
      include: [
        {
          attributes: [],
          required: true,
          association: 'classSchedule',
          where: {
            classScheduleId: data.classScheduleId,
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
            },
            {
              association: 'class',
            },
          ],
        },
      ],
      where: {
        isEnd: true,
      },
    });

    // 获取签到次数
    const info = await this.statInfo.findAll({
      attributes: ['type', [sequelize.fn('COUNT', '*'), 'count']],
      where: {
        classScheduleId: data.classScheduleId,

        ...(data.userId ? { userId: data.userId } : {}),
      },
      group: ['type'],
    });

    // 积分
    const integral = await this.statInfo.findAll({
      attributes: [
        'type',
        [sequelize.fn('SUM', sequelize.col('singTask.sustain')), 'sustains'],
      ],
      where: {
        classScheduleId: data.classScheduleId,
        ...(data.userId ? { userId: data.userId } : {}),
      },
      include: [{ association: 'singTask', required: true, attributes: [] }],
      group: ['type'],
    });

    // 总数减去签到次数就是缺勤次数
    // classScheduleId userId
    // 签到

    return {
      all: all.length,
      info,
      integral,
      allintegral,
    };
  }

  // 获取某一个学生的签到信息
  @Get('getSduentStat')
  async getSduentStat(@Query() payload: any) {
    const data = await this.singTask.findAll({
      where: {
        classScheduleId: payload.classScheduleId,
      },
      include: {
        required:false,
        association: 'students',
        where: {
          userId: payload.userId,
        },
      },
    });
    /**
     * 
     * 
     */

    return data.reduce(
      (pre, nxt) => {

        if (!nxt.students.length) {
          pre[3].push(nxt.toJSON());
          return pre
        }
        
        switch (nxt.students[0].type) {
          case 1:
            pre[1].push(nxt.toJSON());
            break;
          case 0:
            pre[0].push(nxt.toJSON());
            break;
          default:
            pre[3].push(nxt.toJSON());
            break;
        }

        return pre;
      },
      { 1: [], 0: [], 3: [] },
    );
  }
}
