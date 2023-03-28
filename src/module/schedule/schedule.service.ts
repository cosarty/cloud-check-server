import { WeekNum } from '@/constants/weekEnum';
import { ModelsEnum, PickModelType } from '@/models';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { nanoid } from 'nanoid';
import { Op } from 'sequelize';
@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);
  constructor(
    @Inject(ModelsEnum.TimingTask)
    private readonly timingTask: PickModelType<ModelsEnum.TimingTask>,
    @Inject(ModelsEnum.SingTask)
    private readonly singTask: PickModelType<ModelsEnum.SingTask>,
    @Inject(ModelsEnum.ClassSchedule)
    private readonly classSchdule: PickModelType<ModelsEnum.ClassSchedule>,
    @Inject(ModelsEnum.Time)
    private readonly time: PickModelType<ModelsEnum.Time>,
    @Inject(ModelsEnum.ClassHours)
    private readonly classHors: PickModelType<ModelsEnum.ClassHours>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @Timeout(1000)
  async handleCron() {
    this.logger.debug('项目启动:开始轮询定时任务');
    //  轮询 timing表 然后查询  isPeriod===true && classSchedule.starDate  classSchedule.endDate && classSchedule.isEnd
    // 设置过期
    const w = await this.classSchdule.findAll({
      where: {
        [Op.or]: {
          endDate: {
            [Op.lte]: new Date(),
          },
        },
        isEnd: { [Op.not]: true },
      },
    });

    await Promise.all(
      w.map(async (a) => {
        await this.classHors.destroy({
          where: { classScheduleId: a.classScheduleId },
        });
        await this.timingTask.update(
          { isEnd: true },
          { where: { classScheduleId: a.classScheduleId } },
        );
        a.isEnd = true;
        await a.save();
      }),
    );
    // 如果过期了就设置过期
    const timing = await this.timingTask.findAll({
      where: { isPeriod: true, isEnd: false },
      include: {
        association: 'classSchedule',
        where: {
          starDate: {
            [Op.lte]: new Date(),
          },
          endDate: {
            [Op.gte]: new Date(),
          },
        },
      },
    });

    // 开启轮询
    for (const t of timing) {
      this.addTimingTask(t.scheduleName, t.period);
    }
  }

  // 添加轮询
  async addTimingTask(name: string, rule: string) {
    this.logger.debug(`开启轮询 ${name}----（${rule}）`);
    const job = new CronJob(rule, async () => {
      const ch = await this.timingTask.findOne({
        include: [
          {
            association: 'classSchedule',
            include: [{ association: 'course' }],
          },
        ],

        where: { scheduleName: name, isEnd: { [Op.not]: true } },
      });

      if (
        new Date(ch.classSchedule.starDate).getTime() < new Date().getTime()
      ) {
        const {
          integral,
          timingId,
          classSchedule: {
            course: { courseName },
          },
        } = ch;
        const scheduleName = nanoid();
        //  创建一条签到信息
        await this.singTask.create({
          integral,
          timingId,
          taskName: courseName + '(签到)',
          scheduleName,
          taskTime: new Date(),
        });
        // 创建任务 开启签到
        await this.addTimeout(scheduleName, 5000);
      }
      // 轮询到了就插入一条签到信息数据
      this.logger.warn(`工作中`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  // 设置定时
  async addTimeout(name: string, seconds: number) {
    const callback = async () => {
      // 关闭签到
      await this.singTask.update(
        { isEnd: true },
        { where: { scheduleName: name } },
      );
    };

    const timeout = setTimeout(callback, seconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  // 生成规则
  async getClassHoursTaskCorn({
    classScheduleId,
    timeId,
    weekDay,
    keepTime,
  }: any) {
    let cornTab = 's m h * M w';
    const schedule = (
      await this.classSchdule.findByPk(classScheduleId)
    ).toJSON();
    const time = (await this.time.findByPk(timeId)).toJSON();
    const endM = new Date(schedule.endDate).getMonth() + 1;
    const starM = new Date(schedule.starDate).getMonth() + 1;
    const endD = new Date(schedule.endDate).getDate();
    const starD = new Date(schedule.starDate).getDate();
    const mut = time.startTime.split(':')[1];
    cornTab = cornTab
      .replace('w', Object.keys(WeekNum).indexOf(weekDay) + 1 + '')
      .replace('M', starM === endM ? starM + '' : `${starM}-${endM}`)
      .replace('y', `2023`)
      .replace('h', `${time.startTime.split(':')[0]}`)
      .replace('m', `${Number(mut) - keepTime * 1}`)
      .replace('s', `0`);

    return cornTab;
  }

  // 删除任务
  deleteCron(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.warn(`任务 ${name} 终止!`);
  }
}