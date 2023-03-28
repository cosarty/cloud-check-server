import { WeekNum } from '@/constants/weekEnum';
import { ModelsEnum, PickModelType } from '@/models';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';
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
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @Timeout(1000)
  handleCron() {
    this.logger.debug('项目启动:开始轮询定时任务');
    //  轮询 timing表 然后查询  isPeriod===true && classSchedule.starDate  classSchedule.endDate && classSchedule.isEnd
    // 如果过期了就设置过期
  }

  // 添加轮询
  async addTimingTask(name: string, rule: string) {
    console.log('rule: ', rule);
    const job = new CronJob(rule, () => {
      // 轮询到了就插入一条签到信息数据
      this.logger.warn(`工作中`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
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
