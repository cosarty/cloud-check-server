import { ModelsEnum, PickModelType } from '@/models';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);
  constructor(
    @Inject(ModelsEnum.TimingTask)
    private readonly timingTask: PickModelType<ModelsEnum.TimingTask>,
    @Inject(ModelsEnum.SingTask)
    private readonly singTask: PickModelType<ModelsEnum.SingTask>,
  ) {}

  @Timeout(3000)
  handleCron() {
    this.logger.debug('项目启动:开始轮询定时任务');
  }
}
