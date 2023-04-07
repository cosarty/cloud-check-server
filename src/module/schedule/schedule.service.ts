import { WeekNum } from '@/constants/weekEnum';
import { ModelsEnum, PickModelType } from '@/models';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { nanoid } from 'nanoid';
import { Op } from 'sequelize';
import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

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
          isEnd: false,
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

    // 开启当初轮询
    const singTask = await this.singTask.findAll({
      where: { isEnd: false, taskTime: { [Op.gte]: new Date() } },
      include: {
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
      },
    });
 
    for (const sing of singTask) {

      this.singTaskCorn(sing.scheduleName, new Date(sing.taskTime));
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

      // 判断当前轮询时间
      // 当前时间是不是上课时间
      if (
        dayjs().isSameOrAfter(dayjs(ch.classSchedule.starDate)) &&
        dayjs().isSameOrBefore(dayjs(ch.classSchedule.endDate)) &&
        ch.isPeriod
      ) {
        const {
          integral = 60,
          timingId,
          isFace,
          location,
          userId,
          locationName,
          distance,
          classSchedule: {
            course: { courseName },
          },
          classScheduleId,
          sustain,
          areaId,
        } = ch;
        const scheduleName = nanoid();
        //  创建一条签到信息
        await this.singTask.create({
          userId,
          integral,
          timingId,
          distance,
          taskName: courseName + '(签到)',
          scheduleName,
          taskTime: new Date(),
          classScheduleId,
          isFace,
          sustain,
          location,
          locationName,
          areaId,
        });
        // 创建任务 开启签到
        await this.addTimeout(scheduleName, integral);
        // 轮询到了就插入一条签到信息数据
        this.logger.warn(`工作中 ${scheduleName}`);
      }
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  // 设置定时
  async addTimeout(name: string, seconds: number) {
    this.logger.debug(`开启任务 --- 定时器 ${name}`);
    await this.singTask.update(
      { isRun: true },
      { where: { scheduleName: name } },
    );
    const callback = async () => {
      this.logger.warn(`任务结束 ${name}`);
      // 关闭签到
      await this.singTask.update(
        { isEnd: true, isRun: false },
        { where: { scheduleName: name } },
      );
    };

    const timeout = setTimeout(callback, seconds * 1000);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  // 创建单次的任务
  async singTaskCorn(name: string, date: Date) {
    this.logger.debug(
      `启动 单次任务 ${name}----（${dayjs(date).format('YYYY-MM-DD hh:mm')}）`,
    );
    const job = new CronJob(date, async () => {
      const sing = await this.singTask.findOne({
        where: {
          scheduleName: name,
        },
      });
      if (sing) this.addTimeout(sing.scheduleName, sing.integral);
    });
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  // 生成规则
  async getClassHoursTaskCorn({ classScheduleId, timeId, weekDay }: any) {
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
      .replace(
        'w',
        (Object.keys(WeekNum).indexOf(weekDay) + 1 === 7
          ? 0
          : Object.keys(WeekNum).indexOf(weekDay) + 1) + '',
      )
      .replace('M', starM === endM ? starM + '' : `${starM}-${endM}`)
      .replace('y', `2023`)
      .replace('h', `${time.startTime.split(':')[0]}`)
      .replace('m', `${Number(mut)}`)
      .replace('s', `0`);

    return cornTab;
  }

  // 删除任务
  deleteCron(name: string) {
    if (this.schedulerRegistry.doesExist('cron', name)) {
      this.schedulerRegistry.deleteCronJob(name);
      this.logger.warn(`任务 ${name} 终止!`);
    }
  }
}
