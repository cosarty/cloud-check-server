import { HomeModule } from './module/home/home.module';

import { StatInfoModule } from './module/statInfo/statinfo.module';
import { AreaModule } from './module/area/area.module';
import { SingTaskModule } from './module/singTask/singtask.module';
import { TimingModule } from './module/timing/timing.module';
import { ScheduleModule } from './module/schedule/schedule.module';
import { ClassHoursModule } from './module/classHours/classhours.module';
import { ClassScheduleModule } from './module/classSchedule/classschedule.module';
import { CourseModule } from './module/course/course.module';
import { TimeModule } from './module/time/time.module';
import { DepartmentModule } from './module/department/department.module';
import { DetecFaceModule } from './module/detecFace/detecface.module';
import { UserModule } from './module/user/user.module';
import { UploadModule } from './module/upload/upload.module';
import { ClassModule } from './module/class/class.module';
import { SequelizeModule } from './util/global/sequelize.module';
import { StrategyModule } from './util/global/strategy.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filter/http.exception';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import * as config from './config';
import { LoginModule } from './module/login/login.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { MailerModule } from '@nest-modules/mailer';
import { ScheduleModule as RootScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    HomeModule,
    StatInfoModule,
    AreaModule,
    SingTaskModule,
    TimingModule,
    RootScheduleModule.forRoot(),
    ScheduleModule,
    ClassHoursModule,
    ClassScheduleModule,
    CourseModule,
    TimeModule,
    DepartmentModule,
    DetecFaceModule,
    UserModule,
    UploadModule,
    ClassModule,
    SequelizeModule,
    StrategyModule,
    LoginModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...Object.values(config)],
    }),
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('email'),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    // 限流
    // ThrottlerModule.forRoot({
    //   //每60秒
    //   ttl: 10,
    //   //限制接口访问10次
    //   limit: 10,
    // }),
    CacheModule.register({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    {
      // 全局异常过滤器
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // {
    //   // 全局限流守卫
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
